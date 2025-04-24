import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';  

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
     
      <Route path="/feedback" element={
        <ProtectedRoute>
          <FeedbackPage />
        </ProtectedRoute>
      } />

  
      <Route path="/admin" element={
        <ProtectedRoute isAdminRequired={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

     
      <Route path="*" element={<div className="p-4 text-center text-red-500">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
