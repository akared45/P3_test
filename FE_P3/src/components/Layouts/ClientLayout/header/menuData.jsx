import { PersonOutline, Settings, Logout } from "@mui/icons-material";

export const pages = [
  { content: "Trang chủ", to: "/" },
  { content: "Đội ngũ bác sĩ", to: "/doi-ngu-bac-si" },
  {
    content: "Dịch vụ",
    children: [
      { content: "Khám tổng quát", to: "/dich-vu/tong-quat" },
      { content: "Khám chuyên sâu", to: "/dich-vu/chuyen-sau" },
      { content: "Xét nghiệm y khoa", to: "/dich-vu/xet-nghiem" },
    ],
  },
  { content: "Về chúng tôi", to: "/ve-chung-toi" },
  { content: "Liên hệ", to: "/lien-he" },
];

export const settings = [
  { id: 1, label: "Hồ sơ cá nhân", to: "/profile", icon: <PersonOutline fontSize="small" /> },
  { id: 2, label: "Cài đặt tài khoản", to: "/settings", icon: <Settings fontSize="small" /> },
  { id: 3, label: "Đăng xuất", action: "logout", icon: <Logout fontSize="small" />, danger: true },
];