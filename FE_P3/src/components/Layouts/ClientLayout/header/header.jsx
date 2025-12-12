import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../providers/AuthProvider";
import { AppBar, Toolbar, Container } from "@mui/material";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import UserSection from "./UserSection";
import Modal from "../../../ui/modal";
import { patientApi } from "../../../../services/api";
const Header = () => {
  const [profile, setProfile] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setOpenLogoutModal(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const res = await patientApi.getById(user.id);
        setProfile(res.data);
      } catch (error) {
        console.error("Lỗi lấy profile:", error);
      }
    };
    fetchProfile();
  }, [user?.id]);
  
  return (
    <>
      <AppBar
        position="sticky"
        sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <Logo isMobile={false} />
            <MobileMenu />
            <Logo isMobile={true} />
            <DesktopMenu />
            <UserSection
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
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn thoát phiên làm việc không?"
        onConfirm={handleConfirmLogout}
      />

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
};

export default Header;