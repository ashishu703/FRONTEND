import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { API_ENDPOINTS } from '../api/admin_api/api';

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  INITIALIZE: 'INITIALIZE',
  SET_LOADING: 'SET_LOADING',
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.INITIALIZE:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const url = new URL(window.location.href);
        const impersonateToken = url.searchParams.get('impersonateToken');
        if (impersonateToken) {
          try { sessionStorage.setItem('authToken', impersonateToken); } catch {}
          try { sessionStorage.setItem('impersonating', 'true'); } catch {}
          try {
            const profile = await apiClient.get(API_ENDPOINTS.PROFILE);
            if (profile?.success && profile?.data?.user) {
              try { sessionStorage.setItem('user', JSON.stringify(profile.data.user)); } catch {}
            }
          } catch {}
          url.searchParams.delete('impersonateToken');
          window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
        }

        const isImpersonating = sessionStorage.getItem('impersonating') === 'true';
        const token = (isImpersonating ? sessionStorage.getItem('authToken') : null) || apiClient.getAuthToken();
        const user = isImpersonating
          ? JSON.parse(sessionStorage.getItem('user') || 'null')
          : JSON.parse(localStorage.getItem('user') || 'null');
        
        if (token && user) {
          dispatch({
            type: AUTH_ACTIONS.INITIALIZE,
            payload: {
              user,
              isAuthenticated: true,
            },
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.LOGOUT,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({
          type: AUTH_ACTIONS.LOGOUT,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      
      if (response.success && response.data) {
        // Store token and user data
        try {
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('impersonating');
          sessionStorage.removeItem('user');
        } catch {}
        apiClient.setAuthToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.data.user,
          },
        });
        // also return token (needed for impersonation open-in-new-tab)
        return { success: true, user: response.data.user, token: response.data.token };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: {
          error: error.message || 'Login failed',
        },
      });
      return { success: false, error: error.message };
    }
  };

  // Impersonate (SuperAdmin only) - DO NOT mutate current tab state/storage
  const impersonate = async (email) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password: 'superadmin_bypass',
      });
      if (response.success && response.data) {
        return { success: true, user: response.data.user, token: response.data.token };
      }
      return { success: false, error: response.error || 'Impersonation failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function (for SuperAdmin to create users)
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      
      if (response.success && response.data) {
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: {
          error: error.message || 'Registration failed',
        },
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Call logout endpoint if available
      try {
        await apiClient.post(API_ENDPOINTS.LOGOUT);
      } catch (error) {
        // Continue with local logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
      
      // Clear local data
      apiClient.removeAuthToken();
      localStorage.removeItem('user');
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: false, error: error.message };
    }
  };


  // Clear error function
  const clearError = () => {
    dispatch({
      type: AUTH_ACTIONS.LOGIN_FAILURE,
      payload: {
        error: null,
      },
    });
  };

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    impersonate,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider;

