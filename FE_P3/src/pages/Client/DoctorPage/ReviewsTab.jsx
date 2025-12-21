import React from "react";
import {
  Typography,
  Box,
  Chip,
  Rating,
  LinearProgress,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const MOCK_REVIEWS = [
  { id: 1, user: "Phạm Thu H.", rating: 5, date: "2024-12-01", content: "Bác sĩ rất tận tâm, hỏi bệnh kỹ và giải thích rõ ràng. Cảm thấy yên tâm hẳn." },
  { id: 2, user: "Trần Văn Nam", rating: 4, date: "2024-11-20", content: "Tư vấn tốt, nhưng chờ kết nối hơi lâu một chút." },
  { id: 3, user: "Lê Thị M.", rating: 5, date: "2024-11-15", content: "Bác sĩ giỏi, chuyên môn cao. Thuốc kê uống 3 ngày đã đỡ." },
];

const ReviewsTab = ({ doctor }) => {
  const { t } = useTranslation("doctordetail");

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={700}>
          {t("patientFeedbackTitle")}
        </Typography>
        <Chip
          label={t("reviewsCount", { count: MOCK_REVIEWS.length })}
          size="small"
        />
      </Box>
      <Box
        sx={{
          bgcolor: "#f8f9fa",
          p: 3,
          borderRadius: 2,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h3" fontWeight={700} color="primary">
            {doctor.rating || 5.0}
          </Typography>
          <Rating
            value={doctor.rating || 5}
            readOnly
            precision={0.5}
          />
        </Box>
        <Box flex={1}>
          {[5, 4, 3, 2, 1].map((star) => (
            <Box
              key={star}
              display="flex"
              alignItems="center"
              gap={2}
              mb={0.5}
            >
              <Typography variant="caption" sx={{ minWidth: 10 }}>
                {star}
              </Typography>
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
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#ff5722",
                    fontSize: 14,
                  }}
                >
                  {review.user.charAt(0)}
                </Avatar>
                <Typography variant="subtitle2">
                  {review.user}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {review.date}
              </Typography>
            </Box>
            <Rating
              value={review.rating}
              readOnly
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="#444">
              {t(review.content)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default ReviewsTab;