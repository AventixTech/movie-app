import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getToken } from "../auth/AuthService";
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token); 
      console.log("Decoded JWT:", decoded);
      console.log("Raw JWT:", token);

      
      setUser({
        userId: decoded.userId,
        isAdmin: decoded.isAdmin,
        email: decoded.email || localStorage.getItem('email'),
        name: decoded.name || localStorage.getItem('name'),
        token,
      });
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
    }
  }
}, []);


  const isAdmin = user?.isAdmin; 

  // Login user

  const loginUser = async (email, password) => {
  const res = await apiLogin(email, password); 
  const token = res.token || res.data.token;
  localStorage.setItem('token', token);
  localStorage.setItem("email", res.user?.email);
  localStorage.setItem("name", res.user?.name);

    const decoded = jwtDecode(token);
    setUser({
    userId: decoded.userId,
    isAdmin: decoded.isAdmin,
    email: res.user?.email,
    name: res.user?.name,
    token,
  });

  console.log('Decoded JWT in loginUser:', decoded);
  console.log('Raw JWT in loginUser:', token);

  // setUser({ ...decoded, token, name: res.user?.name, email: res.user?.email });
  return res.user;
};


  // Register user
  const registerUser = async (name, email, password) => {
    await apiRegister(name, email, password);
  };

  // Logout
  const logout = () => {
     console.log("User logged out");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};


