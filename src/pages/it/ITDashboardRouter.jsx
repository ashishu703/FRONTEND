import React from 'react';
import ITDashboardMain from './components/ITDashboardMain';
import SystemHealthMonitoring from './components/SystemHealthMonitoring';
import TicketManagement from './components/TicketManagement';
import UserAccessManagement from './components/UserAccessManagement';
import MergedSecurityManagement from './components/MergedSecurityManagement';
import MergedReportsAnalytics from './components/MergedReportsAnalytics';
import ITUserDashboard from './components/ITUserDashboard';
import { useAuth } from '../../context/AuthContext';

const ITDashboardRouter = ({ activeView, setActiveView }) => {
  const { user } = useAuth();
  const isHead = user?.role === 'department_head' || user?.uiUserType === 'itdepartmenthead';

  // IT User gets simplified view
  if (!isHead) {
    return <ITUserDashboard activeView={activeView} setActiveView={setActiveView} />;
  }

  // IT Head gets full features
  switch (activeView) {
    case 'it-dashboard':
      return <ITDashboardMain setActiveView={setActiveView} />;
    case 'it-systems':
      return <SystemHealthMonitoring />;
    case 'it-tickets':
      return <TicketManagement />;
    case 'it-users':
      return <UserAccessManagement />;
    case 'it-security':
      return <MergedSecurityManagement />;
    case 'it-reports':
      return <MergedReportsAnalytics />;
    default:
      return <ITDashboardMain setActiveView={setActiveView} />;
  }
};

export default ITDashboardRouter;

