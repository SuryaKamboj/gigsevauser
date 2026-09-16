import api from './api';

export const fetchServices = async (category = '') => {
  const query = category && category !== 'all' ? `?category=${encodeURIComponent(category.toUpperCase())}` : '';
  const res = await api.get(`/services${query}`);
  return res.data;
};

export const fetchServiceById = async (id) => {
  const res = await api.get(`/services/${id}`);
  return res.data;
};
