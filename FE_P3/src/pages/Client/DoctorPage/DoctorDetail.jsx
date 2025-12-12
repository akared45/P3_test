import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container, Box, Typography, Avatar, Button,
  Chip, Rating, Divider, Paper, Stack, Skeleton, Tabs, Tab, LinearProgress
} from "@mui/material";
import {
  WorkOutline, School, LocationOn, VerifiedUser,
  CalendarMonth, Description, Star, HistoryEdu
} from "@mui/icons-material";

import BreadCrumb from "@components/ui/bread-crumb";
import BookingDialog from "./BookingDialog";
import { doctorApi } from "@services/api";
import { getImageUrl } from "@utils/imageHelper";

// --- MOCK REVIEWS ---
const MOCK_REVIEWS = [
  { id: 1, user: "Phạm Thu H.", rating: 5, date: "2024-12-01", content: "Bác sĩ rất tận tâm, hỏi bệnh kỹ và giải thích rõ ràng. Cảm thấy yên tâm hẳn." },
  { id: 2, user: "Trần Văn Nam", rating: 4, date: "2024-11-20", content: "Tư vấn tốt, nhưng chờ kết nối hơi lâu một chút." },
  { id: 3, user: "Lê Thị M.", rating: 5, date: "2024-11-15", content: "Bác sĩ giỏi, chuyên môn cao. Thuốc kê uống 3 ngày đã đỡ." },
];

// --- HELPER COMPONENT CHO TAB ---
function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      {...other}
      sx={{ flex: 1, overflow: 'auto', p: 3, pb: 5 }}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openBooking, setOpenBooking] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await doctorApi.getById(id);
        setDoctor(res.data || res);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <DoctorDetailSkeleton />;
  if (!doctor) return <Typography sx={{ p: 5, textAlign: 'center' }}>Không tìm thấy bác sĩ</Typography>;

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 8 }}>
      <Box sx={{ bgcolor: "white", py: 2, borderBottom: "1px solid #eee" }}>
        <Container maxWidth="lg">
          <BreadCrumb items={[
            { label: "Trang chủ", to: "/" },
            { label: "Bác sĩ", to: "/bac-si" },
            { label: doctor.fullName, to: "#" }
          ]} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: '0 0 360px', position: { md: 'sticky' }, top: 20, alignSelf: 'flex-start' }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
              <Avatar
                src={getImageUrl(doctor.avatarUrl)}
                alt={doctor.fullName}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2, border: "4px solid #f0f8ff" }}
              />
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {doctor.fullName}
              </Typography>
              <Chip
                label={doctor.specialization?.name || doctor.specCode}
                color="primary"
                variant="soft"
                sx={{ mb: 2, fontWeight: 600, bgcolor: '#e3f2fd', color: '#1976d2' }}
              />
              <Stack direction="row" justifyContent="center" spacing={1} alignItems="center" mb={3}>
                <Rating value={doctor.rating || 5} readOnly precision={0.5} size="small" />
                <Typography variant="body2" color="text.secondary">({doctor.reviewCount || 0} đánh giá)</Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Giá tư vấn:</Typography>
                <Typography color="error" fontWeight={700} variant="h6">
                  {formatCurrency(doctor.fee?.final || 50000)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CalendarMonth />}
                onClick={() => setOpenBooking(true)}
                sx={{ borderRadius: 2, py: 1.5, mt: 2, fontSize: '1rem', textTransform: 'none', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
              >
                Đặt lịch ngay
              </Button>
            </Paper>
          </Box>
          <Box sx={{ flex: 1, minHeight: 600, display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: 'white'
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafafa' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, py: 2.5 }
                  }}
                >
                  <Tab icon={<Description fontSize="small" />} iconPosition="start" label="Thông tin" />
                  <Tab icon={<HistoryEdu fontSize="small" />} iconPosition="start" label="Kinh nghiệm & Học vấn" />
                  <Tab icon={<Star fontSize="small" />} iconPosition="start" label="Đánh giá" />
                </Tabs>
              </Box>

              <CustomTabPanel value={tabValue} index={0}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Giới thiệu</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line', mb: 3 }}>
                  {doctor.bio || `Bác sĩ ${doctor.fullName} là chuyên gia đầu ngành... (Chưa cập nhật tiểu sử)`}
                </Typography>
                <Typography variant="h6" fontWeight={700} gutterBottom>Thông tin nhanh</Typography>
                <Stack spacing={2} mt={1}>
                  <Box display="flex" gap={1.5} alignItems="center">
                    <WorkOutline color="action" />
                    <Typography variant="body2"><strong>{doctor.yearsExperience}+ Năm</strong> kinh nghiệm trong nghề</Typography>
                  </Box>
                  <Box display="flex" gap={1.5} alignItems="center">
                    <VerifiedUser color="action" />
                    <Typography variant="body2">Số chứng chỉ hành nghề: <strong>{doctor.licenseNumber}</strong></Typography>
                  </Box>
                  <Box display="flex" gap={1.5} alignItems="center">
                    <LocationOn color="action" />
                    <Typography variant="body2">Công tác tại: <strong>{doctor.workHistory?.[0]?.place || "Phòng khám Telemedicine"}</strong></Typography>
                  </Box>
                </Stack>
              </CustomTabPanel>

              <CustomTabPanel value={tabValue} index={1}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>Quá trình công tác</Typography>
                {doctor.workHistory?.length > 0 ? (
                  <Stack spacing={3}>
                    {doctor.workHistory.map((work, index) => (
                      <Box key={`work-${index}`} sx={{ position: 'relative', pl: 5 }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 16,
                            top: 0,
                            bottom: index === doctor.workHistory.length - 1 ? '50%' : 0,
                            width: '2px',
                            bgcolor: 'primary.main',
                            opacity: 0.3,
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 8,
                            top: 8,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <WorkOutline sx={{ color: 'white', fontSize: 10 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{work.position}</Typography>
                          <Typography variant="body2" color="text.secondary">{work.place}</Typography>
                          <Typography variant="caption" color="primary" fontWeight={500}>
                            {new Date(work.from).getFullYear()} - {work.to ? new Date(work.to).getFullYear() : "Nay"}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">Chưa cập nhật thông tin.</Typography>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>Quá trình đào tạo</Typography>
                {doctor.qualifications?.length > 0 ? (
                  <Stack spacing={3}>
                    {doctor.qualifications.map((qual, index) => (
                      <Box key={`qual-${index}`} sx={{ position: 'relative', pl: 5 }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 16,
                            top: 0,
                            bottom: index === doctor.qualifications.length - 1 ? '50%' : 0,
                            width: '2px',
                            bgcolor: 'success.main',
                            opacity: 0.3,
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 8,
                            top: 8,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <School sx={{ color: 'white', fontSize: 10 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{qual.degree}</Typography>
                          <Typography variant="body2" color="text.secondary">{qual.institution}</Typography>
                          <Typography variant="caption" color="success.main" fontWeight={500}>
                            {qual.year}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">Chưa cập nhật thông tin.</Typography>
                )}
              </CustomTabPanel>

              {/* TAB 3: ĐÁNH GIÁ */}
              <CustomTabPanel value={tabValue} index={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight={700}>Phản hồi từ bệnh nhân</Typography>
                  <Chip label={`${MOCK_REVIEWS.length} đánh giá`} size="small" />
                </Box>
                <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 2, mb: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight={700} color="primary">{doctor.rating || 5.0}</Typography>
                    <Rating value={doctor.rating || 5} readOnly precision={0.5} />
                  </Box>
                  <Box flex={1}>
                    {[5, 4, 3, 2, 1].map(star => (
                      <Box key={star} display="flex" alignItems="center" gap={2} mb={0.5}>
                        <Typography variant="caption" sx={{ minWidth: 10 }}>{star}</Typography>
                        <Star color="warning" fontSize="inherit" />
                        <LinearProgress
                          variant="determinate"
                          value={star === 5 ? 70 : star === 4 ? 20 : 5}
                          sx={{ flex: 1, height: 6, borderRadius: 5 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Stack spacing={3} divider={<Divider />}>
                  {MOCK_REVIEWS.map((review) => (
                    <Box key={review.id}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff5722', fontSize: 14 }}>
                            {review.user.charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle2">{review.user}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" color="#444">{review.content}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CustomTabPanel>
            </Paper>
          </Box>
        </Box>
      </Container>

      <BookingDialog open={openBooking} onClose={() => setOpenBooking(false)} doctor={doctor} />
    </Box>
  );
};

const DoctorDetailSkeleton = () => (
  <Container maxWidth="lg" sx={{ mt: 5 }}>
    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flex: '0 0 360px' }}>
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 3 }} />
      </Box>
    </Box>
  </Container>
);

export default DoctorDetail;