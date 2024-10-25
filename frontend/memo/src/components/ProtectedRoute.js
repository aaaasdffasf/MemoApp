// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, token } = React.useContext(AuthContext);

  if (!user || !token || token === 'null' || token.trim() === '') {
    return <Navigate to="/login" />;
  }

  return children;
};


export default ProtectedRoute;
