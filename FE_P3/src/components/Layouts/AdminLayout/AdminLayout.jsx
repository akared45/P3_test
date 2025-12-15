import React, { useState } from "react";
import Siderbar from "./Siderbar/Siderbar";
import Header from "./Header/header";
import styles from "./style.module.scss";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layoutWrapper}>
      <Siderbar onToggleCollapse={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <Header isSidebarCollapsed={sidebarCollapsed} />
        <div className={styles.pageContent}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;