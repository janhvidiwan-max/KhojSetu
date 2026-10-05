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
  register: (userData: { name: string; email: string; phone?: string; organization?: string; role?: UserRole; password?: string }) => Promise<boolean>;
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
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('returnhome_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>(user?.role || 'Admin');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const login = async (email: string, pass: string, selectedRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    if (!email || !email.includes('@')) {
      setIsLoading(false);
      throw new Error('Please enter a valid official email address.');
    }
    if (!pass || pass.length < 6) {
      setIsLoading(false);
      throw new Error('Security Error: Password must be at least 6 characters.');
    }

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
      // Fallback local check
    }

    // Check registered local users list
    let localUsers: any[] = [];
    try {
      const stored = localStorage.getItem('returnhome_users');
      if (stored) localUsers = JSON.parse(stored);
    } catch {
      // ignore
    }

    const matchedUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== pass) {
        setIsLoading(false);
        throw new Error('Security Error: Invalid password provided.');
      }
      setUser(matchedUser);
      setActiveRole(matchedUser.role);
      const mockToken = `returnhome-jwt-${Date.now()}`;
      setToken(mockToken);
      localStorage.setItem('returnhome_token', mockToken);
      localStorage.setItem('returnhome_user', JSON.stringify(matchedUser));
      setIsLoading(false);
      return true;
    }

    const assignedRole = selectedRole || (email.includes('admin') ? 'Admin' : email.includes('citizen') ? 'Viewer' : 'Investigator');
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email.toLowerCase(),
      role: assignedRole,
      organization: assignedRole === 'Admin' ? 'Delhi Police Command Center' : assignedRole === 'Viewer' ? 'Public Citizen Reporter' : 'ReturnHome Special Unit',
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

  const register = async (userData: { name: string; email: string; phone?: string; organization?: string; role?: UserRole; password?: string }): Promise<boolean> => {
    setIsLoading(true);
    if (!userData.name || !userData.email || !userData.password) {
      setIsLoading(false);
      throw new Error('Name, email, and password are required.');
    }
    if (userData.password.length < 6) {
      setIsLoading(false);
      throw new Error('Password must be at least 6 characters long.');
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role || 'Investigator',
      organization: userData.organization || 'ReturnHome Investigation Division',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    // Store in local users DB
    try {
      const stored = localStorage.getItem('returnhome_users');
      const usersList = stored ? JSON.parse(stored) : [];
      usersList.push({ ...newUser, password: userData.password, phone: userData.phone });
      localStorage.setItem('returnhome_users', JSON.stringify(usersList));
    } catch {
      // ignore
    }

    setUser(newUser);
    setActiveRole(newUser.role);
    setToken(`returnhome-jwt-reg-${Date.now()}`);
    localStorage.setItem('returnhome_token', `returnhome-jwt-reg-${Date.now()}`);
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
        register,
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
