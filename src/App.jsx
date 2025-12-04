import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import TableManager from './components/TableManager/TableManager';
import QueryExecutor from './components/QueryExecutor/QueryExecutor';
import DataManager from './components/DataManager/DataManager';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tables" element={<TableManager />} />
            <Route path="/query" element={<QueryExecutor />} />
            <Route path="/data" element={<DataManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
