import { Box, Card, CardContent, CardMedia, Typography, Button, Container } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";

const listdoctors = [
  {
    name: "TS. BS. Nguyễn Văn A",
    specialty: "Tim mạch",
    image: "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg",
  },
  {
    name: "ThS. BS. Trần Thị B",
    specialty: "Nhi khoa",
    image: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg",
  },
  {
    name: "BS. CKII. Lê Văn C",
    specialty: "Thần kinh",
    image: "https://img.freepik.com/free-photo/portrait-successful-mid-adult-doctor-with-crossed-arms_1262-12865.jpg",
  }
];

const DoctorsSection = ({ doctors }) => (
  <Box sx={{ bgcolor: "#fff", py: 10 }}>
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Đội ngũ chuyên gia</Typography>
          <Typography variant="subtitle1" color="text.secondary">Gặp gỡ bác sĩ hàng đầu</Typography>
        </Box>
        <Button endIcon={<ArrowForward />} component={Link} to="/doi-ngu-bac-si">Xem tất cả</Button>
      </Box>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
        {listdoctors.map((d, i) => (
          <Card
            key={i}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 32px)", md: "1 1 calc(25% - 32px)" },
              borderRadius: 4,
              border: "1px solid #eee",
            }}
          >
            <CardMedia
              component="img"
              height="320"
              image={d.image}
              sx={{ objectFit: "cover", objectPosition: "top" }}
            />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography fontWeight="bold">{d.name}</Typography>
              <Typography color="primary">{d.specialty}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  </Box>
);

export default DoctorsSection;
