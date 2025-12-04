// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://queryx-k4r7.onrender.com',
  ENDPOINTS: {
    // Query endpoints
    EXECUTE_QUERY: '/query/execute',
    AI_QUERY: '/query/ai-query',
    
    // Schema endpoints
    GET_ALL_TABLES: '/schema/tables',
    GET_ALL_TABLES_SCHEMA: '/schema/tablesSchema',
    GET_TABLE_SCHEMA: '/schema',
    CREATE_TABLE: '/schema/create',
    UPDATE_TABLE: '/schema/update',
    DELETE_TABLE: '/schema/delete',
    
    // Table data endpoints
    INSERT_DATA: '/tabledata/insert',
  }
};

export default API_CONFIG;
