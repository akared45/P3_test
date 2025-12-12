import { Box, Container, Typography, Button, Stack } from "@mui/material";

const HeroSection = () => (
  <Box sx={{ bgcolor: "#f4f7f6", py: 8 }}>
    <Container maxWidth="xl" sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, flexWrap:"wrap" }}>
      <Box sx={{ flex:"1 1 500px" }}>
        <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1}>VỀ MEDICARE</Typography>
        <Typography variant="h2" fontWeight={800} sx={{ mt:1, mb:3, color:"#2c3e50" }}>
          Chăm sóc sức khỏe <br /><Box component="span" sx={{ color:"primary.main" }}>Toàn diện & Tận tâm</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb:4, lineHeight:1.6 }}>
          Chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao...
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="large" sx={{ borderRadius:8, px:4 }}>Đặt lịch khám ngay</Button>
          <Button variant="outlined" size="large" sx={{ borderRadius:8, px:4 }}>Tìm hiểu thêm</Button>
        </Stack>
      </Box>

      <Box sx={{ flex:"1 1 500px", display:"flex", justifyContent:"center" }}>
        <Box component="img" 
             src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg"
             sx={{ width:"100%", borderRadius:4, boxShadow:"0 20px 40px rgba(0,0,0,0.1)" }} />
      </Box>
    </Container>
  </Box>
);

export default HeroSection;
