import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Stack,
  Divider,
} from "@mui/material";
import { AccessTime, Star, WorkOutline } from "@mui/icons-material";
import { getImageUrl } from "../../../utils/imageHelper";
const DoctorCard = ({ doctor, onBook }) => {
  const navigate = useNavigate();
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  const degree = doctor.qualifications?.[0]?.degree || "Bác sĩ";
  const specName = doctor.specialization?.name || "Đa khoa";
  const price = doctor.fee?.final || 50000;
  const avatar = doctor.avatarUrl || "/default-avatar.png";

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          textAlign: "center",
          pt: 4,
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            mb: 3,
            width: "100%",
          }}
        >
          <Avatar
            src={getImageUrl(avatar)}
            alt={doctor.fullName}
            sx={{
              width: 120,
              height: 120,
              margin: "0 auto",
              border: "4px solid #f0f8ff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Chip
            label={specName}
            size="medium"
            color="primary"
            variant="filled"
            sx={{
              position: "absolute",
              bottom: -12,
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 700,
              fontSize: "0.8rem",
              minWidth: 120,
              height: 28,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          />
        </Box>

        <Box sx={{ width: "100%", mb: 2.5 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              mt: 2,
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "#1a237e",
              lineHeight: 1.3,
            }}
          >
            {doctor.fullName}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 2,
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            {degree}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            bgcolor: "#f8f9fa",
            py: 1.5,
            px: 2,
            borderRadius: 3,
            mb: 3,
            border: "1px solid #eaeaea",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Box display="flex" alignItems="center" gap={0.8}>
              <WorkOutline fontSize="small" color="primary" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Kinh nghiệm
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="primary.main"
                >
                  {doctor.yearsExperience || 5}+ Năm
                </Typography>
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ height: 30 }} />
            <Box display="flex" alignItems="center" gap={0.8}>
              <Star fontSize="small" sx={{ color: "#ffb400" }} />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Đánh giá
                </Typography>
                <Typography variant="body2" fontWeight={700} color="#ffb400">
                  {doctor.rating || 5.0} ⭐ ({doctor.reviewCount || 0})
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mt: "auto",
          }}
        >
          <Typography
            variant="h5"
            color="error.main"
            fontWeight={800}
            sx={{
              fontSize: "1.5rem",
              mb: 0.5,
            }}
          >
            {formatCurrency(price)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.9rem",
              letterSpacing: "0.5px",
            }}
          >
            / lượt tư vấn
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ my: 1 }} />

      <CardActions
        sx={{
          p: 3,
          pt: 2,
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Button
          size="medium"
          variant="outlined"
          fullWidth
          onClick={() => navigate(`/bac-si/${doctor.id}`)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            py: 1,
            fontSize: "0.95rem",
            fontWeight: 600,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          Xem chi tiết
        </Button>
        <Button
          size="medium"
          variant="contained"
          fullWidth
          onClick={() => onBook(doctor)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            py: 1,
            fontSize: "0.95rem",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
            },
          }}
        >
          Đặt lịch ngay
        </Button>
      </CardActions>
    </Card>
  );
};

export default DoctorCard;
