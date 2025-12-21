import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Paper,
  Autocomplete,
  TextField,
  Tabs,
  Tab,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CalendarMonth, Settings, Save, Add } from "@mui/icons-material";
import { doctorApi } from "@services/api";
import VisualSchedule from "./VisualSchedule";

const AdminSchedule = () => {
  const { t } = useTranslation("admin_schedule");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.userType?.toLowerCase();

  const DAYS = [
    { key: "Monday", label: t("days.Monday") },
    { key: "Tuesday", label: t("days.Tuesday") },
    { key: "Wednesday", label: t("days.Wednesday") },
    { key: "Thursday", label: t("days.Thursday") },
    { key: "Friday", label: t("days.Friday") },
    { key: "Saturday", label: t("days.Saturday") },
    { key: "Sunday", label: t("days.Sunday") },
  ];

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editorSchedules, setEditorSchedules] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDay, setCurrentDay] = useState("Monday");
  const [newSlot, setNewSlot] = useState({
    start: "08:00",
    end: "17:00",
    maxPatients: 10,
  });
  useEffect(() => {
    if (role !== "admin" && tabValue === 1) {
      setTabValue(0);
    }
  }, [role, tabValue]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await doctorApi.getAll();
      setDoctors(res.data || res);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      setEditorSchedules(selectedDoctor.schedules || []);
    } else {
      setEditorSchedules([]);
    }
  }, [selectedDoctor]);

  const handleAddSlot = () => {
    if (newSlot.start >= newSlot.end) {
      return alert(t("messages.error_time_range"));
    }
    setEditorSchedules([
      ...editorSchedules,
      { ...newSlot, day: currentDay, maxPatients: Number(newSlot.maxPatients) },
    ]);
    setOpenDialog(false);
  };

  const handleDeleteSlot = (indexToDelete) => {
    const daySlots = editorSchedules.filter((s) => s.day === currentDay);
    const slotToRemove = daySlots[indexToDelete];
    setEditorSchedules(editorSchedules.filter((s) => s !== slotToRemove));
  };

  const handleSaveSchedules = async () => {
    if (!selectedDoctor) return;
    setLoadingSave(true);
    try {
      const payload = {
        schedules: editorSchedules,
        fullName: selectedDoctor.fullName,
        licenseNumber: selectedDoctor.licenseNumber,
        specCode:
          selectedDoctor.specialization?.code || selectedDoctor.specCode,
      };
      await doctorApi.update(selectedDoctor.id, payload);
      alert(t("messages.save_success"));
      fetchDoctors();
    } catch (error) {
      alert(t("messages.save_error"));
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {t("title")}
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab
            icon={<CalendarMonth />}
            iconPosition="start"
            label={t("tabs.hospital_schedule")}
          />
          {role === "admin" && (
            <Tab
              icon={<Settings />}
              iconPosition="start"
              label={t("tabs.individual_schedule")}
            />
          )}
        </Tabs>
      </Paper>

      {tabValue === 0 ? (
        <VisualSchedule doctors={doctors} />
      ) : (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Autocomplete
              options={doctors}
              getOptionLabel={(opt) =>
                `${opt.fullName} - ${opt.specCode || ""}`
              }
              value={selectedDoctor}
              onChange={(e, v) => setSelectedDoctor(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("form.select_doctor")}
                  placeholder={t("form.search_doctor")}
                />
              )}
              noOptionsText={t("form.no_doctor_found")}
            />
          </Paper>

          {selectedDoctor ? (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  {t("form.scheduling_for")}{" "}
                  <strong>{selectedDoctor.fullName}</strong>
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveSchedules}
                  disabled={loadingSave}
                >
                  {loadingSave ? t("actions.saving") : t("actions.save_config")}
                </Button>
              </Box>

              <Grid container spacing={2} columns={7}>
                {DAYS.map((day) => (
                  <Grid item xs={7} md={1} key={day.key}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        minHeight: 350,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        align="center"
                        fontWeight="bold"
                        borderBottom="1px solid #eee"
                        pb={1}
                        mb={2}
                      >
                        {day.label}
                      </Typography>
                      <Box flexGrow={1}>
                        {editorSchedules
                          .filter((s) => s.day === day.key)
                          .map((slot, idx) => (
                            <Chip
                              key={idx}
                              label={`${slot.start}-${slot.end}`}
                              onDelete={() => {
                                setCurrentDay(day.key);
                                handleDeleteSlot(idx);
                              }}
                              color="primary"
                              variant="outlined"
                              sx={{ width: "100%", mb: 1 }}
                            />
                          ))}
                      </Box>
                      <Button
                        fullWidth
                        startIcon={<Add />}
                        variant="outlined"
                        onClick={() => {
                          setCurrentDay(day.key);
                          setOpenDialog(true);
                        }}
                      >
                        {t("actions.add_slot")}
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box textAlign="center" py={8} bgcolor="white">
              <Typography>{t("messages.select_doctor_prompt")}</Typography>
            </Box>
          )}
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t("form.add_work_shift")} (
          {DAYS.find((d) => d.key === currentDay)?.label})
        </DialogTitle>
        <DialogContent>
          <Box mt={2} display="flex" flexDirection="column" gap={3}>
            <TextField
              label={t("form.start_time")}
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newSlot.start}
              onChange={(e) =>
                setNewSlot({ ...newSlot, start: e.target.value })
              }
            />
            <TextField
              label={t("form.end_time")}
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newSlot.end}
              onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
            />
            <TextField
              label={t("form.max_patients")}
              type="number"
              fullWidth
              value={newSlot.maxPatients}
              onChange={(e) =>
                setNewSlot({ ...newSlot, maxPatients: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t("actions.cancel")}
          </Button>
          <Button variant="contained" onClick={handleAddSlot}>
            {t("actions.add_new")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default AdminSchedule;
