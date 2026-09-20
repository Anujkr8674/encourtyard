'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  role: 'USER' | 'ADMIN' | 'MANAGER';
  avatarUrl?: string | null;
  isEmailVerified: boolean;
}

export interface AuthAdmin {
  adminId: string;
  name: string;
  email: string;
  role: 'ADMIN';
  isSuperAdmin: boolean;
}

interface SignupParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  admin: AuthAdmin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  signup: (params: SignupParams) => Promise<{ success: boolean; email?: string; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string; error?: string }>;
  adminLogin: (id: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [admin, setAdmin] = useState<AuthAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session check from cookies
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Check User Session
      const userRes = await fetch('/api/auth/user/me', { cache: 'no-store' });
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.authenticated && userData.user) {
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      // 2. Check Admin Session
      const adminRes = await fetch('/api/auth/admin/me', { cache: 'no-store' });
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        if (adminData.authenticated && adminData.admin) {
          setAdmin(adminData.admin);
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    } catch (err) {
      console.error('Session validation error:', err);
      setUser(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Signup with OTP trigger
  const signup = async (params: SignupParams) => {
    try {
      const res = await fetch('/api/auth/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      return { success: true, email: data.email };
    } catch {
      return { success: false, error: 'Network error occurred during registration.' };
    }
  };

  // Verify OTP
  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch('/api/auth/user/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed.' };
      }

      if (data.user) {
        setUser(data.user);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred during verification.' };
    }
  };

  // Resend OTP
  const resendOtp = async (email: string) => {
    try {
      const res = await fetch('/api/auth/user/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to resend code.' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error.' };
    }
  };

  // User Login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          requiresVerification: data.requiresVerification,
          email: data.email,
          error: data.error || 'Invalid credentials.',
        };
      }

      if (data.user) {
        setUser(data.user);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during sign in.' };
    }
  };

  // Admin Login
  const adminLogin = async (id: string, password: string) => {
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Admin authentication failed.' };
      }

      if (data.admin) {
        setAdmin(data.admin);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during admin authentication.' };
    }
  };

  // Logout (Clears both user & admin cookies and reset state)
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setAdmin(null);
      setLoading(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const isAuthenticated = Boolean(user || admin);
  const isAdmin = Boolean(admin || user?.role === 'ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        isAuthenticated,
        isAdmin,
        loading,
        signup,
        verifyOtp,
        resendOtp,
        login,
        adminLogin,
        logout,
        refreshUser,
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
