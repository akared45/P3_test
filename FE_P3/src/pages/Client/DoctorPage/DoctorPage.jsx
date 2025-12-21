import React, { useEffect, useState, useMemo } from "react";
import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";
import BreadCrumb from "../../../components/ui/bread-crumb";
import { doctorApi, specApi } from "../../../services/api";
import BookingDialog from "./BookingDialog";
import FilterSidebar from "./FilterSidebar";
import DoctorList from "./DoctorList";
import PageHeader from "./PageHeader";
import { Pagination, Stack } from "@mui/material";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("all");
  const [selectedDays, setSelectedDays] = useState([]);
  const [experienceRange, setExperienceRange] = useState([0, 50]);
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docsRes, specsRes] = await Promise.all([
          doctorApi.getAll(),
          specApi.getAll(),
        ]);
        const allDocs = docsRes.data || docsRes;
        setDoctors(allDocs.filter((d) => d.isActive));
        setSpecializations(specsRes.data || specsRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDayChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenBooking(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSpec("all");
    setSelectedDays([]);
    setExperienceRange([0, 50]);
    if (isMobile) setFilterDrawerOpen(false);
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const nameMatch =
        doc.profile?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        doc.username?.toLowerCase().includes(searchTerm.toLowerCase());
      const docSpecCode = doc.specialization?.code || doc.specCode || "";
      const specMatch = selectedSpec === "all" || docSpecCode === selectedSpec;
      const years = doc.yearsExperience || 0;
      const expMatch =
        years >= experienceRange[0] && years <= experienceRange[1];
      const docDays = doc.schedules?.map((s) => s.day) || [];
      const dayMatch =
        selectedDays.length === 0 ||
        selectedDays.some((d) => docDays.includes(d));
      return nameMatch && specMatch && expMatch && dayMatch;
    });
  }, [doctors, searchTerm, selectedSpec, selectedDays, experienceRange]);

  const paginatedDoctors = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredDoctors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDoctors, page]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedSpec, selectedDays, experienceRange]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pb: 8 }}>
      <PageHeader
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        isMobile={isMobile}
      />

      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 } }}>
        <Grid container spacing={4} wrap="nowrap">
          {!isMobile && (
            <Grid item xs={12} md={3} lg={2.5} sx={{ flexShrink: 0 }}>
              <FilterSidebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedSpec={selectedSpec}
                setSelectedSpec={setSelectedSpec}
                selectedDays={selectedDays}
                handleDayChange={handleDayChange}
                experienceRange={experienceRange}
                setExperienceRange={setExperienceRange}
                specializations={specializations}
                handleClearFilters={handleClearFilters}
                isMobile={isMobile}
                setFilterDrawerOpen={setFilterDrawerOpen}
              />
            </Grid>
          )}

          <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSpec={selectedSpec}
            setSelectedSpec={setSelectedSpec}
            selectedDays={selectedDays}
            handleDayChange={handleDayChange}
            experienceRange={experienceRange}
            setExperienceRange={setExperienceRange}
            specializations={specializations}
            handleClearFilters={handleClearFilters}
            isMobile={isMobile}
            setFilterDrawerOpen={setFilterDrawerOpen}
            drawerOpen={filterDrawerOpen}
            setDrawerOpen={setFilterDrawerOpen}
            isDrawerOnly={true}
          />

          <Grid item xs={12} md={9} lg={9.5} sx={{ flexGrow: 1, minWidth: 0 }}>
            <DoctorList
              filteredDoctors={paginatedDoctors}
              totalDoctors={filteredDoctors.length}
              loading={loading}
              handleOpenBooking={handleOpenBooking}
              handleClearFilters={handleClearFilters}
              searchTerm={searchTerm}
              selectedSpec={selectedSpec}
              selectedDays={selectedDays}
              experienceRange={experienceRange}
              isMobile={isMobile}
              page={page}
              itemsPerPage={itemsPerPage}
            />

            {!loading && filteredDoctors.length > itemsPerPage && (
              <Stack spacing={2} sx={{ mt: 6, alignItems: "center" }}>
                <Pagination
                  count={Math.ceil(filteredDoctors.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "large"}
                  variant="outlined"
                  shape="rounded"
                />
              </Stack>
            )}
          </Grid>
        </Grid>
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
