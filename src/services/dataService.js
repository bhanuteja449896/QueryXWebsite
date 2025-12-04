import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Insert data into table
export const insertData = async (tableName, rows) => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.INSERT_DATA, {
      tableName,
      rows,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  insertData,
};
