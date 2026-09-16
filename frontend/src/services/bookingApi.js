import api from './api';

export const createBooking = async (payload) => {
  const res = await api.post('/bookings', payload);
  return res.data;
};

export const fetchBookings = async (status = '') => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await api.get(`/bookings${query}`);
  return res.data?.bookings || [];
};

export const fetchBookingById = async (bookingId) => {
  const res = await api.get(`/bookings/${bookingId}`);
  return res.data;
};

export const resolveMaterialRequest = async (bookingId, requestId, action) => {
  const res = await api.post(`/bookings/${bookingId}/material-request/${requestId}/resolve`, { action });
  return res.data;
};

export const cancelBooking = async (bookingId, reason) => {
  const res = await api.post(`/bookings/${bookingId}/cancel`, { reason });
  return res.data;
};

export const fetchTrackingByBookingId = async (bookingId) => {
  const res = await api.get(`/tracking/booking/${bookingId}`);
  return res.data;
};
