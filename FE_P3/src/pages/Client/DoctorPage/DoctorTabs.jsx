import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Description, HistoryEdu, Star } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import InfoTab from "./InfoTab";
import ExperienceTab from "./ExperienceTab";
import ReviewsTab from "./ReviewsTab";

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      {...other}
      sx={{ flex: 1, overflow: "auto", p: 3, pb: 5 }}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

const DoctorTabs = ({ doctor }) => {
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation("doctordetail");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "#fafafa",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              py: 2.5,
            },
          }}
        >
          <Tab
            icon={<Description fontSize="small" />}
            iconPosition="start"
            label={t("tabInfo")}
          />
          <Tab
            icon={<HistoryEdu fontSize="small" />}
            iconPosition="start"
            label={t("tabExperienceEducation")}
          />
          <Tab
            icon={<Star fontSize="small" />}
            iconPosition="start"
            label={t("tabReviews")}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <InfoTab doctor={doctor} />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <ExperienceTab doctor={doctor} />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        <ReviewsTab doctor={doctor} />
      </CustomTabPanel>
    </>
  );
};

export default DoctorTabs;