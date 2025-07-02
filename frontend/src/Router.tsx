import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;