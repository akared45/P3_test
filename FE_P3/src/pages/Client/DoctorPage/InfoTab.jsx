import React from "react";
import { Typography, Box, Stack } from "@mui/material";
import { WorkOutline, VerifiedUser, LocationOn } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const InfoTab = ({ doctor }) => {
  const { t } = useTranslation("doctordetail");

  return (
    <>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {t("sectionIntro")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ lineHeight: 1.8, whiteSpace: "pre-line", mb: 3 }}
      >
        {doctor.bio ||
          t("doctorBioPlaceholder", { name: doctor.fullName })}
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {t("sectionQuickInfo")}
      </Typography>
      <Stack spacing={2} mt={1}>
        <Box display="flex" gap={1.5} alignItems="center">
          <WorkOutline color="action" />
          <Typography variant="body2">
            <strong>{doctor.yearsExperience}+ {t("yearsExperienceLabel")}</strong>
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} alignItems="center">
          <VerifiedUser color="action" />
          <Typography variant="body2">
            {t("licenseNumberLabel")}:{" "}
            <strong>{doctor.licenseNumber}</strong>
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} alignItems="center">
          <LocationOn color="action" />
          <Typography variant="body2">
            {t("workPlaceLabel")}:{" "}
            <strong>
              {doctor.workHistory?.[0]?.place || t("defaultClinic")}
            </strong>
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default InfoTab;