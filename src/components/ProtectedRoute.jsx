import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, isAdminRequired = false }) => {
  const { user, token } = useSelector((state) => state.auth);


  if (!user || !token) {
    return <Navigate to="/login" />;
  }


  if (isAdminRequired && user.role !== 'admin') {
    return <Navigate to="/feedback" />;
  }


  return children;
};

export default ProtectedRoute;
