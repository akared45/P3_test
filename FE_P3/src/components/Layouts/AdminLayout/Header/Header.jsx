import React, { useContext, useState } from "react";
import styles from "./style.module.scss";
import { FaBell } from "react-icons/fa";
import { AuthContext } from "@providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Modal from "../../../ui/modal";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material"; 
import { useTranslation } from "react-i18next"; 
import LanguageSwitcher from "../../../ui/LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation('admin_layout');
  
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const open = Boolean(anchorEl);

  const handleOpenOptions = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    setOpenModal(true);
  };

  const confirmLogout = async () => {
    await logout();
    setOpenModal(false);
    navigate("/dang-nhap");
  };

  const handleProfileClick = () => {
    handleClose();
    navigate("/admin/profile");
  };

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.left}>
        <div className={styles.search}>
          <div className={styles.search__icon}>
            <SearchIcon />
          </div>
          <input
            className={styles.search__input}
            type="text"
            placeholder={t('searchPlaceholder')} 
          />
        </div>
      </div>

      <div className={styles.right}>
        <Box mr={2}>
           <LanguageSwitcher />
        </Box>

        <div className={styles.headerIcon}>
          <FaBell />
        </div>
        <div className={styles.profile} onClick={handleOpenOptions}>
          <div className={styles.avatar}>
            <img src={user?.avatarUrl} alt="" />
          </div>
          <div className={styles.inf}>
            <p className={styles.info_name}>{user?.fullName}</p>
            <p className={styles.info_role}>{user?.userType}</p>
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            minWidth: 220,
          },
        }}
        MenuListProps={{
          sx: {
            "& .MuiMenuItem-root": {
              fontSize: "1rem",
              padding: "12px 20px",
              gap: "12px",
            },

            "& .MuiSvgIcon-root": {
              fontSize: "1.5rem",
            },
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <AccountCircleOutlinedIcon />
          {t('profileMenuItem')}
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          {t('logoutMenuItem')}
        </MenuItem>
      </Menu>

      {openModal && (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title={t('logoutModalTitle')}
          message={t('logoutModalMessage')}
          onConfirm={confirmLogout}
        />
      )}
    </header>
  );
};

export default Header;