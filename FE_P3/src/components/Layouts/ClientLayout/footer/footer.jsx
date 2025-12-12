import React from "react";
import { Link } from "react-router-dom";

// MUI Components
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  IconButton,
  Link as MuiLink // Đổi tên để tránh trùng với Link của router
} from "@mui/material";

// Icons
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  MedicalServices as MedicalIcon
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a2027",
        color: "#fff",
        py: 6,
        mt: "auto",
        borderTop: "4px solid",
        borderColor: "primary.main"
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MedicalIcon sx={{ fontSize: 40, mr: 1, color: 'primary.light' }} />
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                MEDICARE
              </Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              CÔNG TY CỔ PHẦN CÔNG NGHỆ BÁC SỸ BÊN BẠN
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <LocationIcon color="primary" sx={{ fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" color="grey.400">
                  Phòng khám Bác Sỹ Gia Đình Doctor4U <br />
                  Tòa nhà Imperial Suites, 71 Vạn Phúc, Phường Ngọc Hà, Thành phố Hà Nội
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <EmailIcon color="primary" sx={{ fontSize: 20 }} />
                <MuiLink href="mailto:care@doctor4u.vn" color="grey.400" underline="hover">
                  care@doctor4u.vn
                </MuiLink>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <PhoneIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="body2" color="grey.400">
                  Tổng đài: 024 32 212 212 <br />
                  Hotline: 0934 38 12 12 - 0936 56 12 12
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.light' }}>
              Dịch vụ
            </Typography>
            <Stack spacing={1}>
              {['Đặt lịch khám', 'Hỏi đáp bác sĩ', 'Dịch vụ xét nghiệm', 'Gói khám tổng quát'].map((item, index) => (
                <MuiLink
                  key={index}
                  component={Link}
                  to="#"
                  color="grey.400"
                  underline="hover"
                  sx={{ display: 'block', fontSize: '0.95rem' }}
                >
                  {item}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.light' }}>
              Kết nối với chúng tôi
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
              Theo dõi Medicare để nhận những thông tin sức khỏe bổ ích mới nhất.
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: '#1877f2' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: '#ff0000' } }}>
                <YouTubeIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: '#0077b5' } }}>
                <LinkedInIcon />
              </IconButton>
            </Stack>

            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.light', fontSize: '1rem' }}>
              Tải ứng dụng
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" sx={{ height: 40, cursor: 'pointer' }} />
              <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" sx={{ height: 40, cursor: 'pointer' }} />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="grey.500" textAlign="center">
            © 2024 Công ty Cổ phần Công nghệ Bác Sỹ Bên Bạn. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            {['Điều khoản dịch vụ', 'Chính sách bảo mật', 'Chăm sóc khách hàng'].map((text, index) => (
              <MuiLink key={index} href="#" color="grey.500" underline="hover" sx={{ fontSize: '0.85rem' }}>
                {text}
              </MuiLink>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;