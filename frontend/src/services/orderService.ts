// frontend/src/services/orderService.ts
import api from '../services/api'; // depuis un composant

export const fetchOrders = async () => {
  const response = await api.get('/orders'); // à adapter selon ton backend
  return response.data;
};
