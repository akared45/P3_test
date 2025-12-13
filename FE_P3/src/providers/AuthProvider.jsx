import React, { createContext, useEffect, useState } from "react";
import { authApi } from "../services/api";
import {
  setAccessToken,
  clearAccessToken,
} from "../utils/authMemory";
import { disconnectSocket } from "../services/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      try {
        const res = await authApi.refreshToken();

        if (res.data && res.data.accessToken) {
          setAccessToken(res.data.accessToken);
        }
      } catch (error) {
        console.log("Session expired or invalid");
        clearAccessToken();
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async ({ fullName, username, email, password }) => {
    try {
      const payload = {
        username,
        email,
        password,
        profile: { fullName },
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

  const verifyEmail = async (token) => {
    try {
      const res = await authApi.verifyEmail({ token });
      return res.data;
    } catch (error) {
      console.error("Verification failed:", error);
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
    <AuthContext.Provider value={{ user, login, logout, loading, register, verifyEmail }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};