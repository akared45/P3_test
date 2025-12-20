import React from "react";
import { Box, Typography, Grid, Paper, Skeleton } from "@mui/material";
import DoctorCard from "./DoctorCard";
import { useTranslation, Trans } from "react-i18next";

const DoctorList = ({
  filteredDoctors,
  totalDoctors,
  loading,
  handleOpenBooking,
  handleClearFilters,
  searchTerm,
  selectedSpec,
  selectedDays,
  experienceRange,
  isMobile,
  page,
  itemsPerPage,
}) => {
  const { t } = useTranslation("admin_doctors");

  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(page * itemsPerPage, totalDoctors);

  const hasActiveFilters =
    searchTerm ||
    selectedSpec !== "all" ||
    selectedDays.length > 0 ||
    experienceRange[0] > 0 ||
    experienceRange[1] < 50;

  return (
    <>
      {/* ===== HEADER INFO ===== */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="body1" color="text.secondary">
            <Trans
              i18nKey="doctorList.found"
              ns="admin_doctors"
              values={{ count: totalDoctors }}
              components={{ b: <b /> }}
            />
          </Typography>

          {totalDoctors > itemsPerPage && (
            <Typography variant="caption" color="text.secondary">
              {t("doctorList.showing", {
                start: startIndex,
                end: endIndex,
                total: totalDoctors,
              })}
            </Typography>
          )}
        </Box>

        {!isMobile && hasActiveFilters && (
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 600 }}
            onClick={handleClearFilters}
          >
            {t("doctorList.clearFilter")}
          </Typography>
        )}
      </Box>

      {/* ===== LIST ===== */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} lg={4} key={idx}>
              <Paper
                sx={{
                  height: 400,
                  borderRadius: 4,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Skeleton
                  variant="circular"
                  width={80}
                  height={80}
                  sx={{ mb: 2 }}
                />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={150}
                  sx={{ borderRadius: 3 }}
                />
              </Paper>
            </Grid>
          ))
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
              <DoctorCard doctor={doctor} onBook={handleOpenBooking} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                width: "100%",
                bgcolor: "white",
                borderRadius: 4,
                border: "1px solid #ececec",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                alt={t("doctorList.noResultAlt")}
                style={{ width: 120, opacity: 0.5 }}
              />
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mt: 2, mb: 1 }}
              >
                {t("doctorList.noResult")}
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", fontWeight: 600 }}
                onClick={handleClearFilters}
              >
                {t("doctorList.clearAll")}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default DoctorList;
