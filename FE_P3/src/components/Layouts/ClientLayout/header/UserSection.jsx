import { useState } from "react";
import { Box, Button, IconButton, Tooltip, Avatar, Menu, MenuItem, Divider, Typography, Badge, Skeleton } from "@mui/material";
import { Notifications as BellIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { settings } from "./menuData";

const UserSection = ({ user, isLoggedIn, onLogoutRequest }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const getAvatarUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return "http://localhost:3000" + url;
  };

  if (isLoggedIn && !user) {
      return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
        </Box>
      );
  }
  const userInitials = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  return (
    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
      {!isLoggedIn ? (
        <>
          <Button variant="outlined" component={Link} to="/dang-nhap" sx={{ borderRadius: 5, textTransform: 'none' }}>
            Đăng nhập
          </Button>
          <Button variant="contained" component={Link} to="/dang-ky" sx={{ borderRadius: 5, textTransform: 'none', boxShadow: 'none' }}>
            Đăng ký
          </Button>
        </>
      ) : (
        <>
          <IconButton size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}>
            <Badge badgeContent={2} color="error">
              <BellIcon />
            </Badge>
          </IconButton>

          <Tooltip title="Tài khoản">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt={user?.fullName || "User"} 
                src={getAvatarUrl(user?.avatarUrl)} 
                sx={{ bgcolor: 'primary.main', border: '2px solid white', boxShadow: '0 0 0 2px #e3f2fd' }}
              >
                {userInitials}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: '45px' }}
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 200, borderRadius: 3, overflow: 'visible', mt: 1.5,
                '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 },
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                {user?.fullName || "Người dùng"}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.8rem' }}>
                {user?.email || ""}
              </Typography>
            </Box>
            <Divider />

            {settings.map((item) => (
              <MenuItem
                key={item.id}
                component={item.to ? Link : "div"}
                to={item.to}
                onClick={(e) => {
                  handleCloseUserMenu();
                  if (item.action === "logout") {
                    e.preventDefault();
                    onLogoutRequest();
                  }
                }}
                sx={{
                  py: 1, color: item.danger ? 'error.main' : 'text.primary',
                  '&:hover': { bgcolor: item.danger ? 'error.lighter' : 'grey.100' }
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', color: item.danger ? 'error.main' : 'text.secondary' }}>{item.icon}</Box>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default UserSection;