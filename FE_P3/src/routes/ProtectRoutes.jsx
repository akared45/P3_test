import React from "react";
import { Navigate } from "react-router-dom";

const ProtectRoutes = ({ children }) => {
  const userLocal = localStorage.getItem("user");
  const user = userLocal ? JSON.parse(userLocal) : null;

  if (!user) return <Navigate to="/dang-nhap" />;

  const allowRoles = ["admin", "doctor"];

  if (!allowRoles.includes(user.userType)) {
    return <Navigate to="/dang-nhap" />;
  }

  return children;
};

export default ProtectRoutes;
