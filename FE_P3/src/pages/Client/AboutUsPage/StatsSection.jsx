import { Box, Container, Grid, Typography } from "@mui/material";
import { EmojiEvents, Groups, MedicalServices, LocalHospital } from "@mui/icons-material";

const stats = [
  { number:"15+", label:"Năm Kinh Nghiệm", icon:<EmojiEvents fontSize="large" /> },
  { number:"50k+", label:"Bệnh Nhân Hài Lòng", icon:<Groups fontSize="large" /> },
  { number:"100+", label:"Bác Sĩ Chuyên Khoa", icon:<MedicalServices fontSize="large" /> },
  { number:"24/7", label:"Hỗ Trợ Y Tế", icon:<LocalHospital fontSize="large" /> },
];

const StatsSection = () => (
  <Box sx={{ bgcolor:'primary.main', color:'white', py:6 }}>
    <Container maxWidth="xl">
      <Grid container spacing={4} justifyContent="center">
        {stats.map((item,i)=>(
          <Grid item xs={6} md={3} key={i} textAlign="center">
            <Box sx={{ opacity:0.8, mb:1 }}>{item.icon}</Box>
            <Typography variant="h3" fontWeight="bold">{item.number}</Typography>
            <Typography variant="subtitle1" sx={{ opacity:0.9 }}>{item.label}</Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default StatsSection;
