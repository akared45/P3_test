import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BreadCrumb from "../../../components/ui/bread-crumb";
import { doctorApi, specApi } from "../../../services/api";
import DoctorCard from "./DoctorCard";
import BookingDialog from "./BookingDialog";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("all");
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docsRes, specsRes] = await Promise.all([
          doctorApi.getAll(),
          specApi.getAll(),
        ]);
        setDoctors((docsRes.data || docsRes).filter((d) => d.isActive));
        setSpecializations(specsRes.data || specsRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenBooking(true);
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const nameMatch = doc.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const docSpecCode = doc.specialization?.code || doc.specCode || "";
      const specMatch = selectedSpec === "all" || docSpecCode === selectedSpec;
      return nameMatch && specMatch;
    });
  }, [doctors, searchTerm, selectedSpec]);

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 8 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          py: 6,
          mb: 4,
          borderBottom: "1px solid #eaeaea",
          textAlign: "center",
        }}
      >
        <Box sx={{ width: "100%", px: 2 }}>
          <BreadCrumb
            items={[
              { label: "Trang chủ", to: "/" },
              { label: "Đặt lịch khám", to: "/bac-si" },
            ]}
          />
          <Typography variant="h3" fontWeight={700} sx={{ mt: 3, mb: 2 }}>
            Đội ngũ Bác sĩ chuyên khoa
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.6 }}
          >
            Kết nối với các chuyên gia y tế hàng đầu, sẵn sàng tư vấn sức khỏe
            cho bạn mọi lúc, mọi nơi.
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 6,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          placeholder="Tìm kiếm bác sĩ theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, height: 56 },
          }}
          size="medium"
          sx={{
            flex: "1 1 60%",
            "& .MuiOutlinedInput-root": { fontSize: "1.1rem" },
          }}
        />
        <TextField
          select
          fullWidth
          label="Chuyên khoa"
          value={selectedSpec}
          onChange={(e) => setSelectedSpec(e.target.value)}
          sx={{
            flex: "1 1 35%",
            "& .MuiOutlinedInput-root": { fontSize: "1.1rem" },
          }}
        >
          <MenuItem value="all">Tất cả chuyên khoa</MenuItem>
          {specializations.map((spec) => (
            <MenuItem key={spec.code} value={spec.code}>
              {spec.name}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Doctor Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          px: 2,
        }}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <Paper
              key={idx}
              sx={{ width: 280, height: 380, borderRadius: 3, p: 2 }}
            >
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mx: "auto", mb: 3 }}
              />
              <Skeleton variant="text" height={35} sx={{ mb: 1.5 }} />
              <Skeleton
                variant="text"
                width="70%"
                sx={{ mx: "auto", mb: 2.5 }}
              />
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          ))
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={handleOpenBooking}
            />
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 10, width: "100%" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
              alt="No result"
              style={{ width: 180, marginBottom: 25, opacity: 0.7 }}
            />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              Không tìm thấy bác sĩ phù hợp.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng thử lại với từ khóa hoặc chuyên khoa khác.
            </Typography>
          </Box>
        )}
      </Box>

      <BookingDialog
        open={openBooking}
        doctor={selectedDoctor}
        onClose={() => setOpenBooking(false)}
      />
    </Box>
  );
};

export default DoctorPage;
