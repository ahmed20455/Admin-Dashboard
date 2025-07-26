// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductFormPage from './pages/ProductFormPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirect to /dashboard */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-product" element={<ProductFormPage />} />
        <Route path="/products/edit/:id" element={<ProductFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;
