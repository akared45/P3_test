import { Box, Paper, Typography, Avatar, Container } from "@mui/material";
import { MedicalServices } from "@mui/icons-material";

const features = [
  { title:"Công nghệ tiên tiến", desc:"Sử dụng thiết bị y tế hiện đại..." },
  { title:"Đội ngũ tận tâm", desc:"Luôn đặt sức khỏe bệnh nhân lên trên hết." },
  { title:"Quy trình nhanh chóng", desc:"Đặt lịch online – không cần chờ." },
];

const FeaturesSection = () => (
  <Container maxWidth="xl" sx={{ py:10 }}>
    <Box textAlign="center" mb={6}>
      <Typography variant="h4" fontWeight="bold">Tại sao chọn Medicare?</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth:600, mx:'auto' }}>
        Chúng tôi không chỉ chữa bệnh, chúng tôi chăm sóc bạn như người thân.
      </Typography>
    </Box>

    <Box sx={{ display:"flex", flexWrap:"wrap", gap:4, justifyContent:"center" }}>
      {features.map((f,i)=>(
        <Paper key={i} elevation={0} sx={{
            flex:{ xs:"1 1 100%", sm:"1 1 calc(50% - 32px)", md:"1 1 calc(33% - 32px)" },
            p:4, bgcolor:"#f9fafb", borderRadius:4, textAlign:"center",
            transition:"0.3s", "&:hover":{ transform:"translateY(-5px)", boxShadow:3 }
        }}>
          <Avatar sx={{ bgcolor:"primary.light", width:56, height:56, mx:"auto", mb:2 }}>
            <MedicalServices/>
          </Avatar>
          <Typography fontWeight="bold">{f.title}</Typography>
          <Typography color="text.secondary">{f.desc}</Typography>
        </Paper>
      ))}
    </Box>
  </Container>
);

export default FeaturesSection;
