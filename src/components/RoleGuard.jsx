import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ allow = [], children, fallback = null }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return fallback;
  if (allow.length === 0 || allow.includes(user.role)) return children;
  return fallback;
};

export default RoleGuard;
