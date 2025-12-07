import api from './api.js';

export const saleService = {
  async getSales(params) {
    const response = await api.get('/sales', { params });
    return response.data;
  },

  async createSale(saleData) {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  async getSaleById(id) {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  async getFilterOptions() {
    const response = await api.get('/sales/filter-options');
    return response.data;
  }
};
