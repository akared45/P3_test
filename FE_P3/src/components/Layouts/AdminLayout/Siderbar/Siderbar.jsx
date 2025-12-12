import React from "react";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";

const Siderbar = () => {
  return (
    <section className={styles.sidebar} id="sidebar">
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>Health Care</div>
        </div>
      </div>

      <nav className={styles.navMenu}>
        <Link
          to="bang-dieu-khien"
          className={`${styles.navItem} ${styles.active}`}
        >
          <span className={styles.navIcon}>
            <GridViewIcon />
          </span>
          <span>Thống kê</span>
        </Link>

        <Link to="benh-nhan" className={styles.navItem}>
          <span className={styles.navIcon}>
            <PersonOutlineOutlinedIcon />
          </span>
          <span>Bệnh nhân</span>
        </Link>

        <Link to="bac-si" className={styles.navItem}>
          <span className={styles.navIcon}>
            <PeopleAltOutlinedIcon />
          </span>
          <span>Bác sĩ</span>
        </Link>

        <Link to="lich-lam-viec" className={styles.navItem}>
          <span className={styles.navIcon}>
            <CalendarMonthOutlinedIcon />
          </span>
          <span>Lịch làm việc</span>
        </Link>
        <Link to="chuyen-khoa" className={styles.navItem}>
          <span className={styles.navIcon}>
            <MedicalInformationOutlinedIcon />
          </span>
          <span>Chuyên khoa</span>
        </Link>
        <Link to="cai-dat" className={styles.navItem}>
          <span className={styles.navIcon}>
            <SettingsOutlinedIcon />
          </span>
          <span>Cài đặt</span>
        </Link>
      </nav>
    </section>
  );
};

export default Siderbar;
