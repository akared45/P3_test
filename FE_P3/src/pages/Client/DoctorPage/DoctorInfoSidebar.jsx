import React from "react";
import {
  Avatar,
  Typography,
  Button,
  Chip,
  Rating,
  Divider,
  Paper,
  Stack,
  Box,
} from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@utils/imageHelper";

const DoctorInfoSidebar = ({ doctor, onBook }) => {
  const { t } = useTranslation("doctordetail");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <Box
      sx={{
        flex: "0 0 360px",
        position: { md: "sticky" },
        top: 20,
        alignSelf: "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
      >
        <Avatar
          src={getImageUrl(doctor.avatarUrl)}
          alt={doctor.fullName}
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            border: "4px solid #f0f8ff",
          }}
        />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {doctor.fullName}
        </Typography>
        <Chip
          label={doctor.specialization?.name || doctor.specCode}
          color="primary"
          variant="soft"
          sx={{
            mb: 2,
            fontWeight: 600,
            bgcolor: "#e3f2fd",
            color: "#1976d2",
          }}
        />
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          alignItems="center"
          mb={3}
        >
          <Rating
            value={doctor.rating || 5}
            readOnly
            precision={0.5}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            ({t("reviewsCount", { count: doctor.reviewCount || 0 })})
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
        >
          <Typography color="text.secondary">
            {t("consultationPriceLabel")}:
          </Typography>
          <Typography color="error" fontWeight={700} variant="h6">
            {formatCurrency(doctor.fee?.final || 50000)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<CalendarMonth />}
          onClick={onBook}
          sx={{
            borderRadius: 2,
            py: 1.5,
            mt: 2,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
          }}
        >
          {t("bookingButton")}
        </Button>
      </Paper>
    </Box>
  );
};

export default DoctorInfoSidebar;