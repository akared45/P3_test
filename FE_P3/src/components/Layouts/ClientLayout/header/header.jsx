import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../providers/AuthProvider";
import { AppBar, Toolbar, Container } from "@mui/material";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import UserSection from "./UserSection";
import Modal from "../../../ui/modal";
import { patientApi } from "../../../../services/api";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../../ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
const Header = () => {
  const { t } = useTranslation("navigation");
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    navigate("/");
    setOpenLogoutModal(false);
  };

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const res = await patientApi.getById(user.id);
      setProfile(res.data);
    } catch (error) {
      console.error("Lỗi lấy profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <Logo isMobile={false} />
            <MobileMenu />
            <Logo isMobile={true} />
            <DesktopMenu />
            <div style={{ marginRight: "20px" }}>
              <LanguageSwitcher />
            </div>
            <UserSection
              fetchProfile={fetchProfile}
              user={profile}
              isLoggedIn={!!user}
              onLogoutRequest={() => setOpenLogoutModal(true)}
            />
          </Toolbar>
        </Container>
      </AppBar>

      <Modal
        open={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        title={t("logout")}
        message={t("confirmLogout")}
        onConfirm={handleConfirmLogout}
      />

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
};

export default Header;