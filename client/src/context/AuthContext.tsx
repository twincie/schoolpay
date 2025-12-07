import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = { 
  name: string; 
  token: string;
  expiresAt?: number; // Unix timestamp when token expires
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if token is expired
const isTokenExpired = (expiresAt?: number): boolean => {
  if (!expiresAt) return false;
  return Date.now() >= expiresAt * 1000; // Convert to milliseconds
};

// Parse JWT token to get expiration (if using JWT)
const parseJwt = (token: string): { exp?: number } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial auth check

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        // 1. Check for token in localStorage
        const token = localStorage.getItem('token');
        console.log('Token found:', !!token);

        if (token) {
          // 2. Check token expiration from JWT
          const payload = parseJwt(token);
          const expiresAt = payload?.exp;
          console.log('Token payload:', payload);
          console.log('Expires at:', expiresAt, 'Current time:', Date.now(), 'Is expired:', isTokenExpired(expiresAt));

          if (expiresAt && !isTokenExpired(expiresAt)) {
            // 3. Get user info - you might want to fetch from your backend
            // For now, we'll use a placeholder. You can fetch actual user data if needed
            const userName = localStorage.getItem('user_name') || 'User';
            console.log('Restoring user session for:', userName);
            setUser({
              name: userName,
              token,
              expiresAt
            });
          } else {
            // Token expired or invalid, clear it
            console.log('Token expired or invalid, clearing...');
            localStorage.removeItem('token');
            localStorage.removeItem('user_name');
            localStorage.removeItem('token_expires');
          }
        } else {
          console.log('No token found in localStorage');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid tokens on error
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('token_expires');
      } finally {
        console.log('Auth initialization complete');
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up token expiration check interval
  useEffect(() => {
    if (!user?.expiresAt) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(user.expiresAt)) {
        console.log('Token expired, logging out user');
        logout();
      }
    };

    // Check every minute (adjust frequency as needed)
    const interval = setInterval(checkTokenExpiration, 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.expiresAt]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Parse token expiration from JWT
      const payload = parseJwt(data.data.token);
      console.log('Token found:', payload);
      const expiresAt = payload?.exp;

      const userData = {
        name: data.name || email.split('@')[0], // Fallback to username part of email
        token: data.token,
        expiresAt
      };

      setUser(userData);
      
      // Store token and user info in localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user_name', userData.name);
      
      // Optional: Store expiration for quick access
      if (expiresAt) {
        localStorage.setItem('token_expires', expiresAt.toString());
      }
      
    } catch (error) {
      console.error('Login error:', error);
      // Clear any existing tokens on login error
      localStorage.removeItem('token');
      localStorage.removeItem('user_name');
      localStorage.removeItem('token_expires');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    
    // Clear all auth-related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('token_expires');
    
    // If you implement a logout endpoint later, uncomment this:
    /*
    // Call backend logout endpoint if available
    if (user?.token) {
      fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }).catch(console.error);
    }
    */
  };

  // If you want to implement token refresh later, uncomment this:
  /*
  const refreshToken = async (): Promise<string> => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error('Token refresh failed');
      
      const payload = parseJwt(data.token);
      const expiresAt = payload?.exp;
      
      setUser(prev => prev ? {
        ...prev,
        token: data.token,
        expiresAt
      } : null);
      
      localStorage.setItem('token', data.token);
      if (expiresAt) {
        localStorage.setItem('token_expires', expiresAt.toString());
      }
      
      return data.token;
    } catch (error) {
      // If refresh fails, logout the user
      logout();
      throw error;
    }
  };
  */

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};