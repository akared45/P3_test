import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Autocomplete, TextField,
  Tabs, Tab, Button, Grid, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
  CalendarMonth, Settings, Save, Add, Delete
} from "@mui/icons-material";
import { doctorApi } from "@services/api";

import VisualSchedule from "./VisualSchedule";

const DAYS = [
  { key: "Monday", label: "Thứ Hai" },
  { key: "Tuesday", label: "Thứ Ba" },
  { key: "Wednesday", label: "Thứ Tư" },
  { key: "Thursday", label: "Thứ Năm" },
  { key: "Friday", label: "Thứ Sáu" },
  { key: "Saturday", label: "Thứ Bảy" },
  { key: "Sunday", label: "Chủ Nhật" },
];

const AdminSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editorSchedules, setEditorSchedules] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDay, setCurrentDay] = useState("Monday");
  const [newSlot, setNewSlot] = useState({ start: "08:00", end: "17:00", maxPatients: 10 });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await doctorApi.getAll();
      setDoctors(res.data || res);
      console.log(res);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  useEffect(() => {
    if (selectedDoctor) {
      setEditorSchedules(selectedDoctor.schedules || []);
    } else {
      setEditorSchedules([]);
    }
  }, [selectedDoctor]);

  const handleAddSlot = () => {
    if (newSlot.start >= newSlot.end) {
      return alert("Giờ kết thúc phải lớn hơn giờ bắt đầu");
    }

    setEditorSchedules([
      ...editorSchedules,
      { ...newSlot, day: currentDay, maxPatients: Number(newSlot.maxPatients) }
    ]);
    setOpenDialog(false);
  };

  const handleDeleteSlot = (indexToDelete) => {
    const slotToRemove = editorSchedules.filter(s => s.day === currentDay)[indexToDelete];
    setEditorSchedules(editorSchedules.filter(s => s !== slotToRemove));
  };

  const handleSaveSchedules = async () => {
    if (!selectedDoctor) return;
    setLoadingSave(true);
    try {
      const payload = {
        ...selectedDoctor,
        schedules: editorSchedules
      };

      await doctorApi.update(selectedDoctor.id, payload);
      alert("Đã cập nhật lịch làm việc thành công!");
      fetchDoctors();
      const res = await doctorApi.getById(selectedDoctor.id);
      setSelectedDoctor(res.data || res);

    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu lịch!");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#1a202c">
          Quản lý Lịch Bác sĩ
        </Typography>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab icon={<CalendarMonth />} iconPosition="start" label="Lịch trực toàn viện" />
          <Tab icon={<Settings />} iconPosition="start" label="Xếp lịch cá nhân" />
        </Tabs>
      </Paper>

      <div role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <VisualSchedule doctors={doctors} />
        )}
      </div>

      <div role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Autocomplete
                options={doctors}
                getOptionLabel={(option) => `${option.fullName} - ${option.specCode || ''}`}
                value={selectedDoctor}
                onChange={(event, newValue) => setSelectedDoctor(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Chọn Bác sĩ để xếp lịch" placeholder="Tìm tên bác sĩ..." />
                )}
                noOptionsText="Không tìm thấy bác sĩ"
              />
            </Paper>

            {selectedDoctor ? (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Đang xếp lịch cho: <strong>{selectedDoctor.fullName}</strong>
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveSchedules}
                    disabled={loadingSave}
                    size="large"
                    color="success"
                  >
                    {loadingSave ? "Đang lưu..." : "Lưu Cấu Hình"}
                  </Button>
                </Box>

                <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 7, lg: 7, xl: 7 }}>
                  {DAYS.map((day) => {
                    const daySlots = editorSchedules.filter(s => s.day === day.key);
                    return (
                      <Grid item xs={12} sm={6} md={1} lg={1} xl={1} key={day.key}>
                        <Paper variant="outlined" sx={{ minHeight: 350, p: 1.5, bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
                          <Typography
                            align="center" variant="subtitle2"
                            sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2', textTransform: 'uppercase', borderBottom: '1px solid #eee', pb: 1 }}
                          >
                            {day.label}
                          </Typography>

                          <Box flexGrow={1}>
                            {daySlots.map((slot, idx) => (
                              <Chip
                                key={idx}
                                label={`${slot.start}-${slot.end}`}
                                onDelete={() => {
                                  setCurrentDay(day.key);
                                  handleDeleteSlot(idx);
                                }}
                                color="primary" variant="outlined"
                                sx={{ width: '100%', mb: 1, justifyContent: 'space-between', height: 'auto', py: 0.5 }}
                              />
                            ))}
                          </Box>

                          <Button
                            fullWidth size="small" startIcon={<Add />}
                            sx={{ mt: 1, borderStyle: 'dashed' }} variant="outlined"
                            onClick={() => { setCurrentDay(day.key); setOpenDialog(true); }}
                          >
                            Thêm ca
                          </Button>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ) : (
              <Box textAlign="center" py={8} bgcolor="#fff" borderRadius={2}>
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" width={120} style={{ opacity: 0.5 }} alt="" />
                <Typography variant="h6" color="text.secondary" mt={2}>
                  Vui lòng chọn bác sĩ ở trên để bắt đầu xếp lịch.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Thêm ca làm việc ({DAYS.find(d => d.key === currentDay)?.label})</DialogTitle>
        <DialogContent>
          <Box mt={2} display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Giờ bắt đầu" type="time" fullWidth InputLabelProps={{ shrink: true }}
              value={newSlot.start} onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
            />
            <TextField
              label="Giờ kết thúc" type="time" fullWidth InputLabelProps={{ shrink: true }}
              value={newSlot.end} onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
            />
            <TextField
              label="Số khách tối đa" type="number" fullWidth
              value={newSlot.maxPatients} onChange={(e) => setNewSlot({ ...newSlot, maxPatients: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Hủy</Button>
          <Button variant="contained" onClick={handleAddSlot}>Thêm Mới</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSchedule;