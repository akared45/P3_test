import React, { createContext, useEffect, useState } from "react";
import { authApi } from "../services/api";
import {
  setAccessToken,
  clearAccessToken,
} from "../utils/authMemory";
import { disconnectSocket } from "../services/socket"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = async ({ fullName, username, email, password }) => {
    try {
      const payload = {
        username,
        email,
        password,
        profile: {
          fullName,
        },
      };

      const res = await authApi.register(payload);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const login = async ({ email, password }) => {
    try {
      const res = await authApi.login({ email, password });
      const { accessToken } = res.data.auth;
      const userData = res.data.user;
      setAccessToken(accessToken);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAccessToken();
      setUser(null);
      localStorage.removeItem("user");
      disconnectSocket();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};