import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ allow = [], allowDepartmentTypes = [], children, fallback = null }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return fallback;
  const roleAllowed = allow.length === 0 || allow.includes(user.role);
  const deptAllowed = allowDepartmentTypes.length === 0 || allowDepartmentTypes.includes(user.departmentType);
  if (roleAllowed && deptAllowed) return children;
  return fallback;
};

export default RoleGuard;
