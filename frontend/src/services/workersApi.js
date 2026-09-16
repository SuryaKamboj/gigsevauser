import api from './api';

export const fetchWorkers = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') query.append('category', params.category.toUpperCase());
  if (params.societyId) query.append('societyId', params.societyId);
  if (params.experienceTier) query.append('experienceTier', params.experienceTier);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const res = await api.get(`/workers${queryString}`);
  return res?.data?.workers || res?.workers || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
};

export const fetchWorkerById = async (workerId) => {
  const res = await api.get(`/workers/${workerId}`);
  return res?.data || res;
};

export const fetchWorkerReviews = async (workerId) => {
  const res = await api.get(`/workers/${workerId}/reviews`);
  return res?.data || res || [];
};
