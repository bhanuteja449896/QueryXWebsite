import React, { useState, useEffect } from 'react';
import { getAllTables, getAllTablesSchema, createTable, updateTable, deleteTable, getTableSchema } from '../../services/schemaService';
import './TableManager.css';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableSchema, setTableSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Create/Update table form
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([
    { name: '', type: 'VARCHAR', length: 255, primaryKey: false, nullable: true }
  ]);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const tableList = await getAllTables();
      setTables(tableList);
    } catch (error) {
      showMessage('Error loading tables: ' + (error.message || error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTableSchema = async (table) => {
    try {
      const response = await getTableSchema(table);
      // API returns { columns: { columnName: { column_name, data_type, ... } } }
      const schema = response.columns || response;
      setTableSchema(schema);
      setSelectedTable(table);
    } catch (error) {
      showMessage('Error loading table schema: ' + (error.message || error), 'error');
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      const filteredColumns = columns.filter(col => col.name.trim() !== '');
      if (filteredColumns.length === 0) {
        showMessage('Please add at least one column', 'error');
        return;
      }

      await createTable(tableName, filteredColumns);
      showMessage('Table created successfully!', 'success');
      setShowCreateModal(false);
      resetForm();
      loadTables();
    } catch (error) {
      showMessage('Error creating table: ' + (error.message || error), 'error');
    }
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    try {
      const filteredColumns = columns.filter(col => col.name.trim() !== '');
      await updateTable(tableName, filteredColumns);
      showMessage('Table updated successfully!', 'success');
      setShowUpdateModal(false);
      resetForm();
      loadTables();
      if (selectedTable) {
        loadTableSchema(selectedTable);
      }
    } catch (error) {
      showMessage('Error updating table: ' + (error.message || error), 'error');
    }
  };

  const handleDeleteTable = async (table) => {
    if (!window.confirm(`Are you sure you want to delete table "${table}"?`)) {
      return;
    }

    try {
      await deleteTable(table);
      showMessage('Table deleted successfully!', 'success');
      loadTables();
      if (selectedTable === table) {
        setSelectedTable(null);
        setTableSchema(null);
      }
    } catch (error) {
      showMessage('Error deleting table: ' + (error.message || error), 'error');
    }
  };

  const openUpdateModal = async (table) => {
    try {
      const response = await getTableSchema(table);
      // API returns { columns: { columnName: { column_name, data_type, ... } } }
      const schema = response.columns || response;
      setTableName(table);
      
      const cols = Object.entries(schema).map(([name, info]) => ({
        name: info.column_name || name,
        type: (info.data_type || info.type || 'VARCHAR').toUpperCase(),
        length: info.character_maximum_length || info.length || 255,
        primaryKey: info.primaryKey || false,
        nullable: info.is_nullable === 'YES' || info.nullable !== false,
      }));
      
      setColumns(cols);
      setShowUpdateModal(true);
    } catch (error) {
      showMessage('Error loading table for update: ' + (error.message || error), 'error');
    }
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'VARCHAR', length: 255, primaryKey: false, nullable: true }]);
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  const resetForm = () => {
    setTableName('');
    setColumns([{ name: '', type: 'VARCHAR', length: 255, primaryKey: false, nullable: true }]);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const dataTypes = ['VARCHAR', 'INTEGER', 'NUMERIC', 'TEXT', 'TIMESTAMP', 'BOOLEAN', 'DATE', 'TIME'];

  return (
    <div className="table-manager">
      <div className="table-manager-header animate-fade-in-down">
        <h1 className="page-title">
          <span className="gradient-text">Table Manager</span>
        </h1>
        <button className="btn-gradient" onClick={() => setShowCreateModal(true)}>
          ➕ Create New Table
        </button>
      </div>

      {message.text && (
        <div className={`message message-${message.type} animate-fade-in-down`}>
          {message.text}
        </div>
      )}

      <div className="table-manager-content">
        {/* Tables List */}
        <div className="tables-list animate-fade-in-left">
          <h2 className="section-title">Tables ({tables.length})</h2>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : tables.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No tables found. Create your first table!</p>
            </div>
          ) : (
            <div className="table-cards">
              {tables.map((table, index) => (
                <div
                  key={table}
                  className={`table-card ${selectedTable === table ? 'active' : ''} stagger-item`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="table-card-header" onClick={() => loadTableSchema(table)}>
                    <div className="table-icon">🗂️</div>
                    <h3 className="table-name">{table}</h3>
                  </div>
                  <div className="table-card-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => openUpdateModal(table)}
                      title="Edit table"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteTable(table)}
                      title="Delete table"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Schema */}
        <div className="table-schema animate-fade-in-right">
          <h2 className="section-title">Schema Details</h2>
          {selectedTable && tableSchema ? (
            <div className="schema-container">
              <div className="schema-header">
                <h3 className="schema-table-name">{selectedTable}</h3>
              </div>
              <div className="schema-table-wrapper">
                <table className="schema-table">
                  <thead>
                    <tr>
                      <th>Column Name</th>
                      <th>Type</th>
                      <th>Nullable</th>
                      <th>Primary Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(tableSchema).map(([columnName, columnInfo]) => {
                      const displayName = columnInfo.column_name || columnName;
                      const dataType = columnInfo.data_type || columnInfo.type || 'unknown';
                      const maxLength = columnInfo.character_maximum_length || columnInfo.length;
                      const isNullable = columnInfo.is_nullable === 'YES' || columnInfo.nullable !== false;
                      const isPrimaryKey = columnInfo.primaryKey || false;
                      
                      return (
                        <tr key={columnName}>
                          <td className="column-name">{displayName}</td>
                          <td className="column-type">
                            {dataType}
                            {maxLength && ` (${maxLength})`}
                          </td>
                          <td>
                            <span className={`badge ${isNullable ? 'badge-success' : 'badge-error'}`}>
                              {isNullable ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${isPrimaryKey ? 'badge-primary' : 'badge-default'}`}>
                              {isPrimaryKey ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👈</div>
              <p>Select a table to view its schema</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Table Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Table</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateTable}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Table Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="Enter table name"
                    required
                  />
                </div>

                <div className="columns-section">
                  <div className="columns-header">
                    <label>Columns</label>
                    <button type="button" className="btn-add-column" onClick={addColumn}>
                      ➕ Add Column
                    </button>
                  </div>
                  
                  {columns.map((column, index) => (
                    <div key={index} className="column-row">
                      <input
                        type="text"
                        placeholder="Column name"
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        className="form-input"
                        required
                      />
                      <select
                        value={column.type}
                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        className="form-select"
                      >
                        {dataTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {(column.type === 'VARCHAR' || column.type === 'NUMERIC') && (
                        <input
                          type="number"
                          placeholder="Length"
                          value={column.length}
                          onChange={(e) => updateColumn(index, 'length', parseInt(e.target.value))}
                          className="form-input input-short"
                        />
                      )}
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={column.primaryKey}
                          onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                        />
                        PK
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={column.nullable}
                          onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                        />
                        Nullable
                      </label>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-column"
                          onClick={() => removeColumn(index)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gradient">
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Table Modal */}
      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Table: {tableName}</h2>
              <button className="btn-close" onClick={() => setShowUpdateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUpdateTable}>
              <div className="modal-body">
                <div className="columns-section">
                  <div className="columns-header">
                    <label>Columns</label>
                    <button type="button" className="btn-add-column" onClick={addColumn}>
                      ➕ Add Column
                    </button>
                  </div>
                  
                  {columns.map((column, index) => (
                    <div key={index} className="column-row">
                      <input
                        type="text"
                        placeholder="Column name"
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        className="form-input"
                        required
                      />
                      <select
                        value={column.type}
                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        className="form-select"
                      >
                        {dataTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {(column.type === 'VARCHAR' || column.type === 'NUMERIC') && (
                        <input
                          type="number"
                          placeholder="Length"
                          value={column.length}
                          onChange={(e) => updateColumn(index, 'length', parseInt(e.target.value))}
                          className="form-input input-short"
                        />
                      )}
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={column.primaryKey}
                          onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                        />
                        PK
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={column.nullable}
                          onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                        />
                        Nullable
                      </label>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-column"
                          onClick={() => removeColumn(index)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gradient">
                  Update Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;
