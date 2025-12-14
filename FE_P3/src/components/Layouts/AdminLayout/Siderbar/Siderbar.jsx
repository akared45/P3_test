import React from "react";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
const menuItems = [
  {
    label: "Thống kê",
    to: "bang-dieu-khien",
    icon: <GridViewIcon />,
    roles: ["admin", "doctor"],
  },
  {
    label: "Bệnh nhân",
    to: "benh-nhan",
    icon: <PersonOutlineOutlinedIcon />,
    roles: ["admin"],
  },
  {
    label: "Message",
    to: "message",
    icon: <SmsOutlinedIcon />,
    roles: ["doctor"],
  },
  {
    label: "Bác sĩ",
    to: "bac-si",
    icon: <PeopleAltOutlinedIcon />,
    roles: ["admin"],
  },
  {
    label: "Lịch làm việc",
    to: "lich-lam-viec",
    icon: <CalendarMonthOutlinedIcon />,
    roles: ["admin", "doctor"],
  },
  {
    label: "Chuyên khoa",
    to: "chuyen-khoa",
    icon: <MedicalInformationOutlinedIcon />,
    roles: ["admin"],
  },
  {
    label: "Cài đặt",
    to: "cai-dat",
    icon: <SettingsOutlinedIcon />,
    roles: ["admin"],
  },
];

const Siderbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.userType?.toLowerCase();

  return (
    <section className={styles.sidebar} id="sidebar">
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>Health Care</div>
        </div>
      </div>

      <nav className={styles.navMenu}>
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <Link key={item.to} to={item.to} className={styles.navItem}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
      </nav>
    </section>
  );
};

export default Siderbar;
