import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Execute human SQL query
export const executeHumanQuery = async (query) => {
  try {
    const response = await api.post(
      `${API_CONFIG.ENDPOINTS.EXECUTE_QUERY}?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Execute AI-enhanced query
export const executeAIQuery = async (naturalLanguageQuery, tableNames) => {
  try {
    console.log('AI Query Request:', { naturalLanguageQuery, tableNames });
    const response = await api.post(API_CONFIG.ENDPOINTS.AI_QUERY, {
      naturalLanguageQuery,
      tableNames
    });
    console.log('AI Query Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AI Query Service Error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || error.message;
  }
};

export default {
  executeHumanQuery,
  executeAIQuery,
};
