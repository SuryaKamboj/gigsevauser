const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to retrieve stored auth token
 */
export const getAuthToken = () => {
  try {
    const raw = localStorage.getItem('gigseva_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.token) return parsed.token;
      if (parsed.user && parsed.user.token) return parsed.user.token;
    }
    return localStorage.getItem('gigsevak_token') || null;
  } catch {
    return null;
  }
};

export const ensureCustomerToken = async () => {
  let token = getAuthToken();
  if (token) return token;

  try {
    const raw = localStorage.getItem('gigseva_auth');
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed?.user?.phoneNumber) {
      return null;
    }
    const cleanDigits = parsed.user.phoneNumber.replace(/\D/g, '').slice(-10);
    const phone = `+91${cleanDigits}`;
    const name = parsed.user.fullName || 'GigSeva Customer';

    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobileNumber: phone,
        role: 'CUSTOMER',
        fullName: name
      })
    });
    const data = await res.json();
    const freshToken = data?.data?.accessToken || data?.accessToken;
    if (freshToken) {
      localStorage.setItem('gigsevak_token', freshToken);
      if (parsed) {
        parsed.token = freshToken;
        localStorage.setItem('gigseva_auth', JSON.stringify(parsed));
      }
      return freshToken;
    }
  } catch (err) {
    console.warn('[API] ensureCustomerToken failed:', err.message);
  }
  return null;
};

/**
 * Core HTTP client
 */
export const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  let token = getAuthToken();
  if (!token && (endpoint.includes('bookings') || endpoint.includes('users'))) {
    token = await ensureCustomerToken();
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (response.status === 401 && !options._retry && (endpoint.includes('bookings') || endpoint.includes('users'))) {
      const freshToken = await ensureCustomerToken();
      if (freshToken) {
        headers['Authorization'] = `Bearer ${freshToken}`;
        return await request(endpoint, { ...options, headers, _retry: true });
      }
    }

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || `HTTP ${response.status}: Request failed`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    console.warn(`[API Request Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' })
};

export default api;
