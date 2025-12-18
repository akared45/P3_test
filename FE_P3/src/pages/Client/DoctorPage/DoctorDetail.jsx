import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

import BreadCrumb from "@components/ui/bread-crumb";
import BookingDialog from "./BookingDialog";
import DoctorInfoSidebar from "./DoctorInfoSidebar";
import DoctorTabs from "./DoctorTabs";
import SkeletonLoader from "./SkeletonLoader";
import { doctorApi } from "@services/api";

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openBooking, setOpenBooking] = useState(false);
  const { t } = useTranslation("doctordetail");

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

  if (loading) return <SkeletonLoader />;
  if (!doctor)
    return (
      <Typography sx={{ p: 5, textAlign: "center" }}>
        {t("doctorNotFound")}
      </Typography>
    );

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 8 }}>
      <Box sx={{ bgcolor: "white", py: 2, borderBottom: "1px solid #eee" }}>
        <Container maxWidth="lg">
          <BreadCrumb
            items={[
              { label: t("breadcrumbHome"), to: "/" },
              { label: t("breadcrumbDoctors"), to: "/bac-si" },
              { label: doctor.fullName, to: "#" },
            ]}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <DoctorInfoSidebar doctor={doctor} onBook={() => setOpenBooking(true)} />
          
          <Box
            sx={{
              flex: 1,
              minHeight: 600,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                bgcolor: "white",
              }}
            >
              <DoctorTabs doctor={doctor} />
            </Paper>
          </Box>
        </Box>
      </Container>

      <BookingDialog
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        doctor={doctor}
      />
    </Box>
  );
};

export default DoctorDetail;