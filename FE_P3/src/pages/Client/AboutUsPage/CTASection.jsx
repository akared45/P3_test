import { Box, Container, Paper, Typography, Button } from "@mui/material";

const CTASection = () => (
  <Box sx={{ py:10, bgcolor:'#f4f7f6' }}>
    <Container maxWidth="md">
      <Paper elevation={0} sx={{
        p:6, borderRadius:6, textAlign:'center',
        background:'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)', color:'white'
      }}>
        <Typography variant="h4" fontWeight="bold">Sẵn sàng để chăm sóc sức khỏe?</Typography>
        <Typography sx={{ mb:4, opacity:0.9 }}>
          Đặt lịch trực tuyến ngay để được tư vấn tốt nhất.
        </Typography>
        <Button variant="contained" sx={{ bgcolor:"white", color:"primary.main", fontWeight:"bold", px:6 }}>Đặt lịch ngay</Button>
      </Paper>
    </Container>
  </Box>
);

export default CTASection;
