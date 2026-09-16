import React, { createContext, useContext, useState } from 'react';
import { verifyOtp, updateProfile } from '../services/authApi';

const AuthContext = createContext();

export const isProfileComplete = (userObj) => {
  if (!userObj) return false;
  const address = userObj.address || userObj.addresses?.[0]?.addressLine1;
  const city = userObj.city || userObj.addresses?.[0]?.city;
  const pincode = userObj.pincode || userObj.addresses?.[0]?.pincode || userObj.addresses?.[0]?.postalCode;
  const hasValidName = Boolean(
    userObj.fullName &&
    userObj.fullName.trim() &&
    userObj.fullName !== 'New Customer' &&
    userObj.fullName !== 'Customer' &&
    userObj.fullName !== 'GigSevak User'
  );
  return (
    hasValidName &&
    Boolean(address && address.trim() && address !== 'Default Address') &&
    Boolean(city && city.trim()) &&
    Boolean(pincode && pincode.trim())
  );
};

export const AuthProvider = ({ children }) => {
  // Guest mode by default: isAuthenticated is false initially
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('gigseva_auth');
    return saved ? JSON.parse(saved).isAuthenticated : false;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gigseva_auth');
    return saved ? JSON.parse(saved).user : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Splash screen state: show splash screen once per session
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeen = sessionStorage.getItem('gigseva_splash_seen');
    return !hasSeen;
  });

  const finishSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('gigseva_splash_seen', 'true');
  };

  /**
   * Protected Action Gate:
   * Checks if user is authenticated.
   * If authenticated -> runs action callback immediately.
   * If guest -> stores action callback and opens Auth Modal.
   */
  const requireAuth = (actionCallback) => {
    if (isAuthenticated && isProfileComplete(user)) {
      if (typeof actionCallback === 'function') {
        actionCallback();
      }
      return true;
    } else {
      if (typeof actionCallback === 'function') {
        setPendingAction(() => actionCallback);
      }
      setIsAuthModalOpen(true);
      return false;
    }
  };

  const login = async (phoneNumber, additionalDetails = {}) => {
    const existing = user || {};
    let backendToken = null;
    let backendUser = null;
    const cleanDigits = (phoneNumber || '').replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91${cleanDigits}`;

    try {
      const authRes = await verifyOtp(null, 'CUSTOMER', additionalDetails.fullName || '', formattedPhone);
      const token = authRes?.accessToken || authRes?.data?.accessToken;
      const usr = authRes?.user || authRes?.data?.user;
      if (token) {
        backendToken = token;
        backendUser = usr;
        localStorage.setItem('gigsevak_token', backendToken);
      }
    } catch (err) {
      console.warn('[AuthContext] Backend login notice:', err.message);
    }

    const defaultAddr = backendUser?.addresses?.[0];
    const tokenToUse = backendToken || existing.token || localStorage.getItem('gigsevak_token');

    const updatedUser = {
      ...existing,
      ...(backendUser || {}),
      _id: backendUser?._id || backendUser?.userId || existing._id,
      userId: backendUser?._id || backendUser?.userId || existing.userId,
      fullName: backendUser?.fullName || existing.fullName || '',
      phoneNumber: cleanDigits,
      mobileNumber: formattedPhone,
      address: existing.address || defaultAddr?.addressLine1 || '',
      landmark: existing.landmark || defaultAddr?.landmark || '',
      city: existing.city || defaultAddr?.city || '',
      pincode: existing.pincode || defaultAddr?.pincode || defaultAddr?.postalCode || '',
      email: backendUser?.email || existing.email || '',
      ...additionalDetails,
      token: tokenToUse
    };

    setUser(updatedUser);
    
    // Check if profile is complete
    if (isProfileComplete(updatedUser)) {
      setIsAuthenticated(true);
      localStorage.setItem('gigseva_auth', JSON.stringify({ isAuthenticated: true, user: updatedUser, token: tokenToUse }));
      setIsAuthModalOpen(false);

      // Execute pending action after successful authentication
      if (pendingAction && typeof pendingAction === 'function') {
        const actionToRun = pendingAction;
        setPendingAction(null);
        setTimeout(() => {
          actionToRun();
        }, 100);
      }
      return true; // Profile complete
    } else {
      // Profile incomplete -> need to show profile completion screen
      return false; // Profile incomplete
    }
  };

  const completeProfile = async (profileData) => {
    const existingToken = (user && user.token) || localStorage.getItem('gigsevak_token');
    
    let backendUser = null;
    try {
      const updateRes = await updateProfile({
        fullName: profileData.fullName,
        email: profileData.email || '',
        address: profileData.address,
        landmark: profileData.landmark || '',
        city: profileData.city,
        pincode: profileData.pincode
      });
      backendUser = updateRes?.data || updateRes;
    } catch (err) {
      console.warn('[AuthContext] Backend profile update notice:', err.message);
    }

    const defaultAddr = backendUser?.addresses?.[0];
    const cleanDigits = (profileData.phoneNumber || (user && user.phoneNumber) || '').replace(/\D/g, '').slice(-10);

    const updatedUser = {
      ...(user || {}),
      ...(backendUser || {}),
      _id: backendUser?._id || backendUser?.userId || user?._id,
      userId: backendUser?._id || backendUser?.userId || user?.userId,
      fullName: profileData.fullName,
      address: profileData.address || defaultAddr?.addressLine1 || '',
      landmark: profileData.landmark || defaultAddr?.landmark || '',
      city: profileData.city || defaultAddr?.city || '',
      pincode: profileData.pincode || defaultAddr?.pincode || defaultAddr?.postalCode || '',
      email: profileData.email || backendUser?.email || '',
      phoneNumber: cleanDigits,
      mobileNumber: `+91${cleanDigits}`,
      token: existingToken
    };

    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('gigseva_auth', JSON.stringify({ isAuthenticated: true, user: updatedUser, token: existingToken }));
    if (existingToken) {
      localStorage.setItem('gigsevak_token', existingToken);
    }
    setIsAuthModalOpen(false);

    // Automatically resume pending action after saving profile
    if (pendingAction && typeof pendingAction === 'function') {
      const actionToRun = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        actionToRun();
      }, 100);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gigseva_auth');
    localStorage.removeItem('gigsevak_token');
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        requireAuth,
        login,
        completeProfile,
        logout,
        closeAuthModal,
        showSplash,
        finishSplash
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
