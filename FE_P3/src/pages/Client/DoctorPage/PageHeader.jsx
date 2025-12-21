import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import BreadCrumb from "../../../components/ui/bread-crumb";
import { useTranslation } from "react-i18next";

const PageHeader = ({ filterDrawerOpen, setFilterDrawerOpen, isMobile }) => {
  const { t } = useTranslation("admin_doctors");
  return (
    <Box
      sx={{ bgcolor: "white", py: 4, borderBottom: "1px solid #eaeaea", mb: 4 }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 } }}>
        <BreadCrumb
          items={[
            { label: t("pageHeader.breadcrumb.home"), to: "/" },
            { label: t("pageHeader.breadcrumb.booking"), to: "/bac-si" },
          ]}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="h4" fontWeight={800}>
            {t("pageHeader.title")}
          </Typography>
          {isMobile && (
            <IconButton
              onClick={() => setFilterDrawerOpen(true)}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
              }}
            >
              <TuneIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
