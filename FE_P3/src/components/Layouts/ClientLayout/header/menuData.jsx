import {
  PersonOutline,
  AlternateEmailOutlined,
  Settings,
  Logout,
} from "@mui/icons-material";

export const pages = [
  { key: "menuHome", to: "/" },
  { key: "menuDoctors", to: "/doi-ngu-bac-si" },

  { key: "menuAbout", to: "/ve-chung-toi" },
  { key: "menuContact", to: "/lien-he" },
];

export const settings = [
  {
    id: 1,
    key: "userMenuProfile",
    to: "/profile",
    icon: <PersonOutline fontSize="small" />,
  },
  {
    id: 2,
    key: "userMenuInbox",
    to: "/inbox",
    icon: <AlternateEmailOutlined fontSize="small" />,
  },
  {
    id: 3,
    key: "userMenuSettings",
    to: "/settings",
    icon: <Settings fontSize="small" />,
  },
  {
    id: 4,
    key: "userMenuLogout",
    action: "logout",
    icon: <Logout fontSize="small" />,
    danger: true,
  },
];
