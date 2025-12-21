import React from "react";
import { Typography, Box, Stack, Divider } from "@mui/material";
import { WorkOutline, School } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const ExperienceTab = ({ doctor }) => {
  const { t } = useTranslation("doctordetail");

  return (
    <>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{ mb: 3 }}
      >
        {t("workHistoryTitle")}
      </Typography>
      {doctor.workHistory?.length > 0 ? (
        <Stack spacing={3}>
          {doctor.workHistory.map((work, index) => (
            <Box
              key={`work-${index}`}
              sx={{ position: "relative", pl: 5 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  top: 0,
                  bottom:
                    index === doctor.workHistory.length - 1
                      ? "50%"
                      : 0,
                  width: "2px",
                  bgcolor: "primary.main",
                  opacity: 0.3,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 8,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WorkOutline sx={{ color: "white", fontSize: 10 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {work.position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {work.place}
                </Typography>
                <Typography
                  variant="caption"
                  color="primary"
                  fontWeight={500}
                >
                  {new Date(work.from).getFullYear()} -{" "}
                  {work.to ? new Date(work.to).getFullYear() : t("presentLabel")}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t("notUpdated")}
        </Typography>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{ mb: 3 }}
      >
        {t("educationHistoryTitle")}
      </Typography>
      {doctor.qualifications?.length > 0 ? (
        <Stack spacing={3}>
          {doctor.qualifications.map((qual, index) => (
            <Box
              key={`qual-${index}`}
              sx={{ position: "relative", pl: 5 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  top: 0,
                  bottom:
                    index === doctor.qualifications.length - 1
                      ? "50%"
                      : 0,
                  width: "2px",
                  bgcolor: "success.main",
                  opacity: 0.3,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 8,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <School sx={{ color: "white", fontSize: 10 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {qual.degree}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {qual.institution}
                </Typography>
                <Typography
                  variant="caption"
                  color="success.main"
                  fontWeight={500}
                >
                  {qual.year}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t("notUpdated")}
        </Typography>
      )}
    </>
  );
};

export default ExperienceTab;