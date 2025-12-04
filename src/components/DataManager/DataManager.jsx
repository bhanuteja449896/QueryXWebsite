import React, { useState, useEffect } from 'react';
import { getAllTables, getTableSchema } from '../../services/schemaService';
import { insertData } from '../../services/dataService';
import './DataManager.css';

const DataManager = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableSchema, setTableSchema] = useState(null);
  const [rows, setRows] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadTableSchema();
    }
  }, [selectedTable]);

  const loadTables = async () => {
    try {
      const tableList = await getAllTables();
      setTables(tableList);
    } catch (error) {
      showMessage('Error loading tables: ' + (error.message || error), 'error');
    }
  };

  const loadTableSchema = async () => {
    try {
      const response = await getTableSchema(selectedTable);
      // API returns { columns: { columnName: { column_name, data_type, ... } } }
      const schema = response.columns || response;
      
      // Transform schema to expected format
      const transformedSchema = {};
      Object.entries(schema).forEach(([key, info]) => {
        const columnName = info.column_name || key;
        transformedSchema[columnName] = {
          type: (info.data_type || info.type || 'VARCHAR').toUpperCase(),
          nullable: info.is_nullable === 'YES' || info.nullable !== false,
          primaryKey: info.primaryKey || false,
        };
      });
      
      setTableSchema(transformedSchema);
      // Initialize first row with empty values
      const initialRow = {};
      Object.keys(transformedSchema).forEach(column => {
        initialRow[column] = '';
      });
      setRows([initialRow]);
    } catch (error) {
      showMessage('Error loading table schema: ' + (error.message || error), 'error');
    }
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
    setTableSchema(null);
    setRows([{}]);
  };

  const addRow = () => {
    const newRow = {};
    if (tableSchema) {
      Object.keys(tableSchema).forEach(column => {
        newRow[column] = '';
      });
    }
    setRows([...rows, newRow]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRowValue = (rowIndex, columnName, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnName]: value };
    setRows(newRows);
  };

  const convertValue = (value, type) => {
    if (value === '' || value === null) {
      return null;
    }

    switch (type.toUpperCase()) {
      case 'INTEGER':
        return parseInt(value, 10);
      case 'NUMERIC':
      case 'DECIMAL':
      case 'FLOAT':
      case 'DOUBLE':
        return parseFloat(value);
      case 'BOOLEAN':
        return value === 'true' || value === '1' || value === true;
      default:
        return value;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTable) {
      showMessage('Please select a table', 'error');
      return;
    }

    setLoading(true);
    try {
      // Convert rows to API format
      const formattedRows = rows.map(row => {
        return Object.entries(row).map(([columnName, value]) => ({
          name: columnName,
          value: convertValue(value, tableSchema[columnName].type),
        }));
      });

      const result = await insertData(selectedTable, formattedRows);
      
      if (result.rc === '200') {
        showMessage(result.message, 'success');
        // Reset form
        const initialRow = {};
        Object.keys(tableSchema).forEach(column => {
          initialRow[column] = '';
        });
        setRows([initialRow]);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Error inserting data: ' + (error.message || error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const getInputType = (columnType) => {
    const type = columnType.toUpperCase();
    if (type.includes('INT')) return 'number';
    if (type.includes('NUMERIC') || type.includes('DECIMAL') || type.includes('FLOAT')) return 'number';
    if (type.includes('BOOL')) return 'checkbox';
    if (type.includes('DATE') && !type.includes('TIME')) return 'date';
    if (type.includes('TIME') && !type.includes('STAMP')) return 'time';
    if (type.includes('TIMESTAMP')) return 'datetime-local';
    return 'text';
  };

  return (
    <div className="data-manager">
      <div className="data-manager-header animate-fade-in-down">
        <h1 className="page-title">
          <span className="gradient-text">Data Manager</span>
        </h1>
        <p className="page-subtitle">Insert data into your database tables</p>
      </div>

      {message.text && (
        <div className={`message message-${message.type} animate-fade-in-down`}>
          {message.text}
        </div>
      )}

      <div className="data-manager-content">
        {/* Table Selection */}
        <div className="table-selection animate-fade-in-up delay-100">
          <label className="selection-label">Select Table</label>
          <select
            className="table-select"
            value={selectedTable}
            onChange={handleTableChange}
          >
            <option value="">-- Choose a table --</option>
            {tables.map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>
        </div>

        {/* Data Form */}
        {selectedTable && tableSchema && (
          <form onSubmit={handleSubmit} className="data-form animate-fade-in-up delay-200">
            <div className="form-header">
              <h2 className="form-title">Insert Data into: {selectedTable}</h2>
              <button type="button" className="btn-add-row" onClick={addRow}>
                ➕ Add Row
              </button>
            </div>

            <div className="rows-container">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="data-row">
                  <div className="row-header">
                    <h3 className="row-title">Row {rowIndex + 1}</h3>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-row"
                        onClick={() => removeRow(rowIndex)}
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  <div className="row-fields">
                    {Object.entries(tableSchema).map(([columnName, columnInfo]) => (
                      <div key={columnName} className="field-group">
                        <label className="field-label">
                          {columnName}
                          {!columnInfo.nullable && (
                            <span className="required-mark">*</span>
                          )}
                          <span className="field-type">({columnInfo.type})</span>
                        </label>
                        
                        {columnInfo.type.toUpperCase().includes('TEXT') ? (
                          <textarea
                            className="field-input field-textarea"
                            value={row[columnName] || ''}
                            onChange={(e) => updateRowValue(rowIndex, columnName, e.target.value)}
                            required={!columnInfo.nullable}
                            rows="3"
                          />
                        ) : getInputType(columnInfo.type) === 'checkbox' ? (
                          <div className="checkbox-container">
                            <input
                              type="checkbox"
                              className="field-checkbox"
                              checked={row[columnName] === true || row[columnName] === 'true'}
                              onChange={(e) => updateRowValue(rowIndex, columnName, e.target.checked)}
                            />
                            <span className="checkbox-label-text">
                              {row[columnName] === true || row[columnName] === 'true' ? 'True' : 'False'}
                            </span>
                          </div>
                        ) : (
                          <input
                            type={getInputType(columnInfo.type)}
                            className="field-input"
                            value={row[columnName] || ''}
                            onChange={(e) => updateRowValue(rowIndex, columnName, e.target.value)}
                            required={!columnInfo.nullable}
                            step={columnInfo.type.toUpperCase().includes('NUMERIC') ? '0.01' : undefined}
                          />
                        )}

                        {columnInfo.primaryKey && (
                          <span className="field-badge badge-primary">Primary Key</span>
                        )}
                        {columnInfo.nullable && (
                          <span className="field-badge badge-nullable">Nullable</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSelectedTable('');
                  setTableSchema(null);
                  setRows([{}]);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-gradient btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    Inserting...
                  </>
                ) : (
                  <>💾 Insert Data</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Empty State */}
        {!selectedTable && (
          <div className="empty-state animate-fade-in-up delay-200">
            <div className="empty-icon">📋</div>
            <h3>No Table Selected</h3>
            <p>Select a table from the dropdown above to start inserting data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManager;
