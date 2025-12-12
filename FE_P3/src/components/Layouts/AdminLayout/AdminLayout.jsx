import React from "react";
import Siderbar from "./Siderbar/Siderbar";
import Header from "./Header/header";
import styles from "./style.module.scss";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Siderbar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
