import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/Auth/LoginPage.jsx'
import AnocabLanding from './pages/landingpage.jsx'
import SupportPage from './pages/support.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import MainDashboard from './pages/MainDashboard.jsx'
import SalesDepartmentHeadLayout from './pages/SalesDepartmentHead/SalesDepartmentHeadLayout.jsx'
import SalesDepartmentHeadDashboard from './pages/SalesDepartmentHead/SalesDepartmentHeadDashboard.jsx'
import MarketingDepartmentHeadLayout from './pages/MarketingDepartmentHead/MarketingDepartmentHeadLayout.jsx'
import MarketingDepartmentHeadDashboard from './pages/MarketingDepartmentHead/MarketingDepartmentHeadDashboard.jsx'
import HRDepartmentLayout from './pages/HRDepartment/HRDepartmentLayout.jsx'
import HRDepartmentDashboard from './pages/HRDepartment/HRDepartmentDashboard.jsx'
import SalespersonLayout from './pages/salesperson/salespersonlayout.jsx'
import MarketingSalespersonLayout from './pages/MarketingSalesperson/MarketingSalespersonLayout.jsx'
import TeleSalesLayout from './pages/TeleSales/TeleSalesLayout.jsx'
import OfficeSalesPersonLayout from './pages/OfficeSalesPerson/OfficeSalesPersonLayout.jsx'
import ProductionDepartmentHeadLayout from './pages/ProductionDepartmentHead/ProductionDepartmentHeadLayout.jsx'
import ProductionDepartmentHeadDashboard from './pages/ProductionDepartmentHead/ProductionDepartmentHeadDashboard.jsx'
import ProductionStaffLayout from './pages/production/productionlayout.jsx'
import AccountsLayout from './pages/accounts/AccountsLayout.jsx'
import AccountsDashboard from './pages/accounts/accountsdashboard.jsx'
import ItLayout from './pages/it/ItLayout.jsx'
import ItDashboard from './pages/it/itdashboard.jsx'
import { getUserTypeForRole } from './constants/auth'
import RoleGuard from './components/RoleGuard'

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  
  // Listen for pathname changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }
    
    // Check pathname on mount and when it changes
    handleLocationChange()
    
    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange)
    
    // Check pathname periodically (for programmatic navigation)
    const interval = setInterval(handleLocationChange, 100)
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      clearInterval(interval)
    }
  }, [])
  
  // Get userType from URL parameters or user role
  const getCurrentUserType = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlUserType = urlParams.get('userType')
    const isLogin = urlParams.get('login')
    
    if (isLogin === 'true' && urlUserType) {
      return urlUserType
    }
    
    if (!user) return 'superadmin'
    if (user.uiUserType) return user.uiUserType
    return getUserTypeForRole(user.role, user.departmentType)
  }
  
  const userType = getCurrentUserType()

  const handleLogout = async () => {
    await logout()
    setActiveView('dashboard')
  }

  // Check if we should show dashboard based on URL parameters even if not authenticated
  const shouldShowDashboard = isAuthenticated || (new URLSearchParams(window.location.search).get('login') === 'true')
  
  // If not authenticated, check the path to decide what to show
  if (!shouldShowDashboard) {
    // If path is /login, show login page
    if (currentPath === '/login' || currentPath.startsWith('/login')) {
      return (
        <div className="App">
          <LoginPage />
        </div>
      )
    }
    // Support page is now protected - redirect to login if not authenticated
    if (currentPath === '/support' || currentPath.startsWith('/support')) {
      return (
        <div className="App">
          <LoginPage />
        </div>
      )
    }
    // Otherwise show landing page (for / or any other path)
    return (
      <div className="App">
        <AnocabLanding />
      </div>
    )
  }
  
  // Handle support route for authenticated users
  if (shouldShowDashboard && (currentPath === '/support' || currentPath.startsWith('/support'))) {
    return (
      <div className="App">
        <SupportPage />
      </div>
    )
  }
  
  return (
    <div className="App">
      {shouldShowDashboard ? (
        userType === 'salesdepartmenthead' ? (
          <SalesDepartmentHeadLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
            <SalesDepartmentHeadDashboard activeView={activeView} setActiveView={setActiveView} />
          </SalesDepartmentHeadLayout>
        ) :         userType === 'marketingdepartmenthead' ? (
          <MarketingDepartmentHeadLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
            <MarketingDepartmentHeadDashboard activeView={activeView} setActiveView={setActiveView} />
          </MarketingDepartmentHeadLayout>
        ) : userType === 'hrdepartmenthead' ? (
          <HRDepartmentLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
            <HRDepartmentDashboard activeView={activeView} setActiveView={setActiveView} />
          </HRDepartmentLayout>
        ) : userType === 'salesperson' ? (
          <SalespersonLayout onLogout={handleLogout} />
        ) : userType === 'marketing-salesperson' ? (
          <MarketingSalespersonLayout />
        ) : userType === 'productiondepartmenthead' ? (
          <RoleGuard allow={['department_head']} allowDepartmentTypes={['production','Production Department']} fallback={<LoginPage />}>
            <ProductionDepartmentHeadLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
              <ProductionDepartmentHeadDashboard activeView={activeView} setActiveView={setActiveView} />
            </ProductionDepartmentHeadLayout>
          </RoleGuard>
        ) : userType === 'production-staff' ? (
          <RoleGuard allow={['department_user']} allowDepartmentTypes={['production','Production Department']} fallback={<LoginPage />}>
            <ProductionStaffLayout onLogout={handleLogout} />
          </RoleGuard>
        ) : userType === 'tele-sales' ? (
          <TeleSalesLayout />
        ) : userType === 'office-sales-person' ? (
          <OfficeSalesPersonLayout />
        ) : userType === 'accountsdepartmenthead' || userType === 'accounts-user' ? (
          <AccountsLayout
            onLogout={handleLogout}
            activeView={activeView}
            setActiveView={setActiveView}
            headerUserType={userType}
          >
            <AccountsDashboard activeView={activeView} setActiveView={setActiveView} />
          </AccountsLayout>
        ) : userType === 'itdepartmenthead' || userType === 'it-user' ? (
          <ItLayout
            onLogout={handleLogout}
            activeView={activeView}
            setActiveView={setActiveView}
            headerUserType={userType}
          >
            <ItDashboard activeView={activeView} setActiveView={setActiveView} />
          </ItLayout>
        ) : (
          <DashboardLayout onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
            <MainDashboard activeView={activeView} setActiveView={setActiveView} />
          </DashboardLayout>
        )
      ) : null}
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
