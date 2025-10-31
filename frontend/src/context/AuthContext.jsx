// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider (a component that provides the context)
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // 3. Check for a token in localStorage when the app first loads
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 4. Login function: saves the token to state and localStorage
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // 5. Logout function: removes the token from state and localStorage
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // 6. Provide these values to all children components
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Create a custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};