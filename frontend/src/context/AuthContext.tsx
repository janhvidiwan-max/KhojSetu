import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: UserRole;
  isDemoMode: boolean;
  login: (email: string, pass: string, selectedRole?: UserRole) => Promise<boolean>;
  loginWithGoogle: (googleUser: { name: string; email: string; picture?: string }) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setDemoMode: (active: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('returnhome_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // ignore
    }
    return {
      id: 'usr-admin-1',
      name: 'Inspector Vikram Singh',
      email: 'vikram.singh@returnhome.gov.in',
      role: 'Admin',
      organization: 'Special Missing Persons Unit, Law Enforcement',
      status: 'Active',
      createdAt: '2026-01-15T09:00:00.000Z'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('returnhome_token') || 'returnhome-jwt-token-2026';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>(user?.role || 'Admin');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const login = async (email: string, pass: string, selectedRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiService.login(email, pass);
      if (res.token && res.user) {
        const assignedUser = { ...res.user, role: selectedRole || res.user.role };
        setToken(res.token);
        setUser(assignedUser);
        setActiveRole(assignedUser.role);
        localStorage.setItem('returnhome_token', res.token);
        localStorage.setItem('returnhome_user', JSON.stringify(assignedUser));
        setIsLoading(false);
        return true;
      }
    } catch {
      // Fallback
    }

    const assignedRole = selectedRole || (email.includes('admin') ? 'Admin' : email.includes('citizen') ? 'Viewer' : 'Investigator');
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: assignedRole,
      organization: assignedRole === 'Admin' ? 'Delhi Police Command Center' : assignedRole === 'Viewer' ? 'Public Citizen Reporter' : 'ReturnHome Investigation Unit',
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setActiveRole(newUser.role);
    setToken('returnhome-session-jwt-2026');
    localStorage.setItem('returnhome_token', 'returnhome-session-jwt-2026');
    localStorage.setItem('returnhome_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const loginWithGoogle = (googleUser: { name: string; email: string; picture?: string }) => {
    const newUser: User = {
      id: `usr-google-${Date.now()}`,
      name: googleUser.name,
      email: googleUser.email,
      role: 'Investigator',
      organization: 'Verified Google OAuth User',
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setActiveRole('Investigator');
    setToken('returnhome-google-oauth-token-2026');
    localStorage.setItem('returnhome_token', 'returnhome-google-oauth-token-2026');
    localStorage.setItem('returnhome_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('returnhome_token');
    localStorage.removeItem('returnhome_user');
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('returnhome_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        activeRole,
        isDemoMode,
        login,
        loginWithGoogle,
        logout,
        switchRole,
        setDemoMode: setIsDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
