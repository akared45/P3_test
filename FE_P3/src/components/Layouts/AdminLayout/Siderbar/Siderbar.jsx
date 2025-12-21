import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import { Link, useLocation } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation("admin_sidebar");
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.userType?.toLowerCase();
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("");

  const menuItems = [
    {
      label: t("dashboardMenu"),
      to: "bang-dieu-khien",
      icon: <GridViewIcon />,
      roles: ["admin", "doctor"],
    },
    {
      label: t("patientsMenu"),
      to: "benh-nhan",
      icon: <PersonOutlineOutlinedIcon />,
      roles: ["admin"],
    },
    {
      label: t("medicineMenu"),
      to: "thuoc",
      icon: <MedicalServicesOutlinedIcon />,
      roles: ["doctor", "admin"],
    },
    {
      label: t("doctorsMenu"),
      to: "bac-si",
      icon: <PeopleAltOutlinedIcon />,
      roles: ["admin"],
    },
    {
      label: t("scheduleMenu"),
      to: "lich-lam-viec",
      icon: <CalendarMonthOutlinedIcon />,
      roles: ["admin", "doctor"],
    },
    {
      label: t("specialtiesMenu"),
      to: "chuyen-khoa",
      icon: <MedicalInformationOutlinedIcon />,
      roles: ["admin"],
    },
  ];

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setActivePath(path);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/dang-nhap";
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <section
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      id="sidebar"
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <LocalHospitalIcon className={styles.logoIcon} />
          {!collapsed && (
            <div className={styles.logoText}>
              <h2>HealthCare</h2>
              <span className={styles.logoSubtitle}>{t("logoSubtitle")}</span>
            </div>
          )}
        </div>

        <button
          className={styles.toggleButton}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={
            collapsed ? t("toggleExpandAria") : t("toggleCollapseAria")
          }
        >
          {collapsed ? (
            <ChevronRightIcon sx={{ fontSize: 30 }} />
          ) : (
            <ChevronLeftIcon sx={{ fontSize: 30 }} />
          )}
        </button>
      </div>

      {!collapsed && user && (
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{user?.name?.charAt(0) || "U"}</div>
          <div className={styles.userInfo}>
            <h4>{user?.name || "User"}</h4>
            <span className={styles.userType}>
              {role === "admin" ? t("adminRole") : t("doctorRole")}
            </span>
          </div>
        </div>
      )}

      <nav className={styles.navMenu}>
        {filteredMenuItems.map((item) => {
          const isActive = activePath === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge && <span className={styles.badge}>3</span>}
                </>
              )}
              {isActive && <div className={styles.activeIndicator}></div>}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogoutOutlinedIcon />
          {!collapsed && <span>{t("logoutButton")}</span>}
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
