import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link as RouterLink } from "react-router-dom"; // nếu dùng react-router

const MyBreadcrumbs = ({ items }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return isLast ? (
          <Typography key={index} sx={{ color: "text.primary" }}>
            {item.label}
          </Typography>
        ) : (
          <RouterLink
            key={index}
            to={item.to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {item.label}
          </RouterLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default MyBreadcrumbs;
