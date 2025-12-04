import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { executeHumanQuery, executeAIQuery } from '../../services/queryService';
import { getAllTables } from '../../services/schemaService';
import './QueryExecutor.css';

const QueryExecutor = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryType, setQueryType] = useState(searchParams.get('type') || 'human');
  
  // Human Query State
  const [humanQuery, setHumanQuery] = useState('');
  
  // AI Query State
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  
  // Results State
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setQueryType(type);
    }
  }, [searchParams]);

  const loadTables = async () => {
    try {
      const tables = await getAllTables();
      setAvailableTables(tables);
    } catch (error) {
      showMessage('Error loading tables: ' + (error.message || error), 'error');
    }
  };

  const handleQueryTypeChange = (type) => {
    setQueryType(type);
    setSearchParams({ type });
    setQueryResult(null);
    setMessage({ text: '', type: '' });
  };

  const handleHumanQuerySubmit = async (e) => {
    e.preventDefault();
    if (!humanQuery.trim()) {
      showMessage('Please enter a SQL query', 'error');
      return;
    }

    setLoading(true);
    setQueryResult(null);
    try {
      const result = await executeHumanQuery(humanQuery);
      
      // Extract column names from data if columns array is null
      if (result.data && result.data.length > 0 && !result.columns) {
        result.columns = Object.keys(result.data[0]);
      }
      
      setQueryResult(result);
      if (result.rc === '200') {
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      console.error('Human query error:', error);
      const errorMsg = error?.message || error?.toString() || 'Unknown error';
      showMessage('Error executing query: ' + errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAIQuerySubmit = async (e) => {
    e.preventDefault();
    if (!naturalLanguageQuery.trim()) {
      showMessage('Please enter a natural language query', 'error');
      return;
    }
    if (selectedTables.length === 0) {
      showMessage('Please select at least one table', 'error');
      return;
    }

    setLoading(true);
    setQueryResult(null);
    try {
      const result = await executeAIQuery(naturalLanguageQuery, selectedTables);
      
      // Extract column names from data if columns array is null
      if (result.data && result.data.length > 0 && !result.columns) {
        result.columns = Object.keys(result.data[0]);
      }
      
      setQueryResult(result);
      if (result.rc === '200') {
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      console.error('AI query error:', error);
      const errorMsg = error?.message || error?.toString() || 'Unknown error';
      showMessage('Error executing AI query: ' + errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleTableSelection = (table) => {
    setSelectedTables(prev =>
      prev.includes(table)
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const queryExamples = {
    human: [
      'SELECT * FROM users LIMIT 10',
      'SELECT COUNT(*) FROM orders WHERE status = \'active\'',
      'SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.name',
    ],
    ai: [
      'Show me all users who registered in the last 30 days',
      'What are the top 10 products by sales?',
      'Find all orders with amounts greater than $1000',
      'List customers who have never made a purchase',
    ],
  };

  return (
    <div className="query-executor">
      <div className="query-executor-header animate-fade-in-down">
        <h1 className="page-title">
          <span className="gradient-text">Query Executor</span>
        </h1>
      </div>

      {message.text && (
        <div className={`message message-${message.type} animate-fade-in-down`}>
          {message.text}
        </div>
      )}

      {/* Query Type Tabs */}
      <div className="query-tabs animate-fade-in-up delay-100">
        <button
          className={`tab-button ${queryType === 'human' ? 'active' : ''}`}
          onClick={() => handleQueryTypeChange('human')}
        >
          <span className="tab-icon">💻</span>
          SQL Query
        </button>
        <button
          className={`tab-button ${queryType === 'ai' ? 'active' : ''}`}
          onClick={() => handleQueryTypeChange('ai')}
        >
          <span className="tab-icon">🤖</span>
          AI Query
        </button>
      </div>

      <div className="query-content">
        {/* Human Query Form */}
        {queryType === 'human' && (
          <div className="query-form-container animate-fade-in-up delay-200">
            <div className="query-form-card">
              <h2 className="form-title">Execute SQL Query</h2>
              <p className="form-description">
                Write and execute raw SQL queries directly against your database
              </p>
              
              <form onSubmit={handleHumanQuerySubmit}>
                <div className="form-group">
                  <label>SQL Query</label>
                  <textarea
                    className="form-textarea"
                    value={humanQuery}
                    onChange={(e) => setHumanQuery(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    rows="8"
                    required
                  />
                </div>

                <button type="submit" className="btn-gradient btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                      Executing...
                    </>
                  ) : (
                    <>▶️ Execute Query</>
                  )}
                </button>
              </form>

              <div className="query-examples">
                <h3>Example Queries:</h3>
                {queryExamples.human.map((example, index) => (
                  <div
                    key={index}
                    className="example-item"
                    onClick={() => setHumanQuery(example)}
                  >
                    <code>{example}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Query Form */}
        {queryType === 'ai' && (
          <div className="query-form-container animate-fade-in-up delay-200">
            <div className="query-form-card">
              <h2 className="form-title">AI-Powered Query</h2>
              <p className="form-description">
                Describe what data you need in natural language, and AI will generate the SQL
              </p>
              
              <form onSubmit={handleAIQuerySubmit}>
                <div className="form-group">
                  <label>What data do you need?</label>
                  <textarea
                    className="form-textarea"
                    value={naturalLanguageQuery}
                    onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                    placeholder="E.g., Show me all users who registered in the last 30 days"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Tables</label>
                  <div className="table-selector">
                    {availableTables.length === 0 ? (
                      <div className="empty-state-small">
                        <p>No tables available. Create tables first.</p>
                      </div>
                    ) : (
                      <div className="table-chips">
                        {availableTables.map(table => (
                          <button
                            key={table}
                            type="button"
                            className={`table-chip ${selectedTables.includes(table) ? 'selected' : ''}`}
                            onClick={() => toggleTableSelection(table)}
                          >
                            <span className="chip-icon">🗂️</span>
                            {table}
                            {selectedTables.includes(table) && <span className="chip-check">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedTables.length > 0 && (
                    <div className="selected-tables-info">
                      Selected: {selectedTables.join(', ')}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-gradient btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                      Generating & Executing...
                    </>
                  ) : (
                    <>🚀 Generate & Execute</>
                  )}
                </button>
              </form>

              <div className="query-examples">
                <h3>Example Questions:</h3>
                {queryExamples.ai.map((example, index) => (
                  <div
                    key={index}
                    className="example-item"
                    onClick={() => setNaturalLanguageQuery(example)}
                  >
                    <span className="example-icon">💡</span>
                    {example}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Query Results */}
        {queryResult && (
          <div className="query-results animate-fade-in-up delay-300">
            <div className="results-card">
              <div className="results-header">
                <h2>Query Results</h2>
                <div className="results-meta">
                  <span className="meta-item">
                    ⏱️ {queryResult.executionTimeMs}ms
                  </span>
                  <span className="meta-item">
                    📊 {queryResult.rowsAffected} rows
                  </span>
                </div>
              </div>

              {queryResult.executedQuery && (
                <div className="executed-query">
                  <h3>Executed SQL:</h3>
                  <code>{queryResult.executedQuery}</code>
                </div>
              )}

              {queryResult.data && queryResult.data.length > 0 ? (
                <div className="results-table-wrapper">
                  <table className="results-table">
                    <thead>
                      <tr>
                        {queryResult.columns.map(column => (
                          <th key={column}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.data.map((row, index) => (
                        <tr key={index}>
                          {queryResult.columns.map(column => (
                            <td key={column}>
                              {row[column] !== null && row[column] !== undefined
                                ? String(row[column])
                                : <span className="null-value">NULL</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : queryResult.rc === '200' ? (
                <div className="empty-result">
                  <div className="empty-icon">📭</div>
                  <p>Query executed successfully but returned no data</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryExecutor;
