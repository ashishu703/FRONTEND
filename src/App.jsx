import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/Auth/LoginPage.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import MainDashboard from './pages/MainDashboard.jsx'
import SalesDepartmentHeadLayout from './pages/SalesDepartmentHead/SalesDepartmentHeadLayout.jsx'
import SalesDepartmentHeadDashboard from './pages/SalesDepartmentHead/SalesDepartmentHeadDashboard.jsx'
import MarketingDepartmentHeadLayout from './pages/MarketingDepartmentHead/MarketingDepartmentHeadLayout.jsx'
import MarketingDepartmentHeadDashboard from './pages/MarketingDepartmentHead/MarketingDepartmentHeadDashboard.jsx'
import SalespersonLayout from './pages/salesperson/salespersonlayout.jsx'
import MarketingSalespersonLayout from './pages/MarketingSalesperson/MarketingSalespersonLayout.jsx'
import TeleSalesLayout from './pages/TeleSales/TeleSalesLayout.jsx'
import OfficeSalesPersonLayout from './pages/OfficeSalesPerson/OfficeSalesPersonLayout.jsx'
import { getUserTypeForRole } from './constants/auth'

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  
  // Get userType from URL parameters or user role
  const getCurrentUserType = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlUserType = urlParams.get('userType')
    const isLogin = urlParams.get('login')
    
    if (isLogin === 'true' && urlUserType) {
      return urlUserType
    }
    
    return user ? getUserTypeForRole(user.role, user.departmentType) : 'superadmin'
  }
  
  const userType = getCurrentUserType()

  const handleLogout = async () => {
    await logout()
    setActiveView('dashboard')
  }

  // Check if we should show dashboard based on URL parameters even if not authenticated
  const shouldShowDashboard = isAuthenticated || (new URLSearchParams(window.location.search).get('login') === 'true')
  
  return (
    <div className="App">
      {shouldShowDashboard ? (
        userType === 'salesdepartmenthead' ? (
          <SalesDepartmentHeadLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
            <SalesDepartmentHeadDashboard activeView={activeView} setActiveView={setActiveView} />
          </SalesDepartmentHeadLayout>
        ) : userType === 'marketingdepartmenthead' ? (
          <MarketingDepartmentHeadLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
            <MarketingDepartmentHeadDashboard activeView={activeView} setActiveView={setActiveView} />
          </MarketingDepartmentHeadLayout>
        ) : userType === 'salesperson' ? (
          <SalespersonLayout onLogout={handleLogout} />
        ) : userType === 'marketing-salesperson' ? (
          <MarketingSalespersonLayout />
        ) : userType === 'tele-sales' ? (
          <TeleSalesLayout />
        ) : userType === 'office-sales-person' ? (
          <OfficeSalesPersonLayout />
        ) : (
          <DashboardLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
            <MainDashboard activeView={activeView} setActiveView={setActiveView} />
          </DashboardLayout>
        )
      ) : (
        <LoginPage />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
