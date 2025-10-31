export const ROLES = {
  SUPERADMIN: 'superadmin',
  DEPARTMENT_HEAD: 'department_head',
  DEPARTMENT_USER: 'department_user',
  MARKETING_DEPARTMENT_HEAD: 'marketing_department_head',
  HR_DEPARTMENT_HEAD: 'hr_department_head',
};

export const getUserTypeForRole = (role, departmentType = null) => {
  switch (role) {
    case ROLES.DEPARTMENT_HEAD:
      // Check department type to determine which dashboard to show
      if (departmentType === 'marketing_sales' || departmentType === 'Marketing Department') {
        return 'marketingdepartmenthead';
      }
      if (departmentType === 'hr' || departmentType === 'Human Resources') {
        return 'hrdepartmenthead';
      }
      if (departmentType === 'production' || departmentType === 'Production Department') {
        return 'productiondepartmenthead';
      }
      return 'salesdepartmenthead';
    case ROLES.MARKETING_DEPARTMENT_HEAD:
      return 'marketingdepartmenthead';
    case ROLES.HR_DEPARTMENT_HEAD:
      return 'hrdepartmenthead';
    case ROLES.DEPARTMENT_USER:
      if (departmentType === 'production' || departmentType === 'Production Department') {
        return 'production-staff';
      }
      return 'salesperson';
    case ROLES.SUPERADMIN:
    default:
      return 'superadmin';
  }
};
