import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTables, getAllTablesSchema } from '../../services/schemaService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTables: 0,
    totalColumns: 0,
    loading: true,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const tables = await getAllTables();
      const schema = await getAllTablesSchema();
      
      let totalColumns = 0;
      Object.values(schema).forEach(tableSchema => {
        totalColumns += Object.keys(tableSchema).length;
      });

      setStats({
        totalTables: tables.length,
        totalColumns,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const quickActions = [
    {
      title: 'Create Table',
      description: 'Design and create a new database table',
      icon: '➕',
      link: '/tables',
      gradient: 'var(--gradient-primary)',
    },
    {
      title: 'AI Query',
      description: 'Ask questions in natural language',
      icon: '🤖',
      link: '/query?type=ai',
      gradient: 'var(--gradient-secondary)',
    },
    {
      title: 'SQL Query',
      description: 'Execute raw SQL queries',
      icon: '💻',
      link: '/query?type=human',
      gradient: 'var(--gradient-success)',
    },
    {
      title: 'Insert Data',
      description: 'Add new records to tables',
      icon: '📝',
      link: '/data',
      gradient: 'var(--gradient-warning)',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header animate-fade-in-down">
        <h1 className="dashboard-title">
          Welcome to <span className="gradient-text">QueryX</span>
        </h1>
        <p className="dashboard-subtitle">
          Manage your database with AI-powered queries and intuitive interfaces
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in-up delay-100">
          <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
            🗂️
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.loading ? '...' : stats.totalTables}</h3>
            <p className="stat-label">Total Tables</p>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up delay-200">
          <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
            📋
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.loading ? '...' : stats.totalColumns}</h3>
            <p className="stat-label">Total Columns</p>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up delay-300">
          <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>
            ⚡
          </div>
          <div className="stat-content">
            <h3 className="stat-value">Active</h3>
            <p className="stat-label">Database Status</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title animate-fade-in-up delay-400">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              to={action.link}
              className={`quick-action-card animate-scale-in delay-${(index + 5) * 100}`}
              style={{ '--card-gradient': action.gradient }}
            >
              <div className="action-icon">{action.icon}</div>
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
              <div className="action-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section animate-fade-in-up delay-800">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>AI-Powered Queries</h3>
            <p>Transform natural language into SQL queries using advanced AI</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Schema Management</h3>
            <p>Create, update, and delete tables with an intuitive interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Data Visualization</h3>
            <p>View and analyze query results in beautiful table formats</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast & Responsive</h3>
            <p>Optimized for both desktop and mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
