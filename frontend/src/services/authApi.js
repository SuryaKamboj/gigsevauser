import api from './api';

export const requestOtp = async (mobileNumber, role = 'CUSTOMER') => {
  const res = await api.post('/auth/login', { mobileNumber, role });
  return res.data;
};

export const verifyOtp = async (firebaseIdToken, role = 'CUSTOMER', fullName = '', mobileNumber = '') => {
  const res = await api.post('/auth/verify-otp', { firebaseIdToken, role, fullName, mobileNumber });
  return res.data;
};

export const fetchCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/users/me', profileData);
  return res.data;
};
