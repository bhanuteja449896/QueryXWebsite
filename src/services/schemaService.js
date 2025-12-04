import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all table names
export const getAllTables = async () => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.GET_ALL_TABLES);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all tables schema
export const getAllTablesSchema = async () => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.GET_ALL_TABLES_SCHEMA);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single table schema
export const getTableSchema = async (tableName) => {
  try {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.GET_TABLE_SCHEMA}/${tableName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create table
export const createTable = async (tableName, columns) => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.CREATE_TABLE, {
      tableName,
      columns,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update table
export const updateTable = async (tableName, columns) => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.UPDATE_TABLE, {
      tableName,
      columns,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete table
export const deleteTable = async (tableName) => {
  try {
    const response = await api.delete(`${API_CONFIG.ENDPOINTS.DELETE_TABLE}/${tableName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getAllTables,
  getAllTablesSchema,
  getTableSchema,
  createTable,
  updateTable,
  deleteTable,
};
