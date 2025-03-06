import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      // Validate email and password
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Mock login validation
      if (email === 'admin@example.com') {
        const adminUser = {
          id: '1',
          email,
          name: 'Admin User',
          isAdmin: true,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=admin`,
        };
        setUser(adminUser);
        return { success: true };
      } else if (email === 'user@example.com') {
        const regularUser = {
          id: '2',
          email,
          name: 'Regular User',
          isAdmin: false,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=user`,
        };
        setUser(regularUser);
        return { success: true };
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider; 