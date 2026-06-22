import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
});

export const submitTransaction = async (data, idempotencyKey) => {
  const response = await api.post('/transaction', data, {
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });
  return response.data;
};

export const getSummary = async (userId) => {
  const response = await api.get(`/summary/${userId}`);
  return response.data;
};

export const getRanking = async () => {
  const response = await api.get('/ranking');
  return response.data;
};
