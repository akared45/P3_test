import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
const ProtectRoutes = ({ children }) => {
  const userLocal = localStorage.getItem("user");
  const user = userLocal ? JSON.parse(userLocal) : null;

  if (!user || user.userType !== "admin") return <Navigate to="/dang-nhap" />;
  return children;
};

export default ProtectRoutes;
