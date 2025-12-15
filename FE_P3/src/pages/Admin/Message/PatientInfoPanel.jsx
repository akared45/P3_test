import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, TextField, Button, Avatar, Chip, Divider, Skeleton
} from "@mui/material";
import {
  Description as FileIcon,
  AccessTime as TimeIcon,
  MedicalServices as MedicalIcon,
  Female, Male, CheckCircle,
  WarningAmber as WarningIcon
} from "@mui/icons-material";
import { format } from 'date-fns';
import PrescriptionDialog from './PrescriptionDialog';
import { patientApi } from '../../../services/api';

export default function PatientInfoPanel({ activeApp, onRefresh }) {
  const [openPrescription, setOpenPrescription] = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const patientId = activeApp?.patient?.id || activeApp?.patientId;

      if (!patientId) {
        setPatientProfile(null);
        return;
      }

      setLoadingProfile(true);
      try {
        const res = await patientApi.getUserById(patientId);
        setPatientProfile(res.data?.data || res.data);
      } catch (error) {
        console.error("Lỗi lấy hồ sơ:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchPatientDetails();
  }, [activeApp]);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    try {
      const diff = Date.now() - new Date(dob).getTime();
      const ageDate = new Date(diff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return isNaN(age) ? 'N/A' : age;
    } catch {
      return 'N/A';
    }
  };

  const handlePrescriptionSuccess = () => {
    setOpenPrescription(false);
    if (onRefresh) onRefresh();
  };

  const displayAvatar = patientProfile?.avatarUrl || activeApp?.patient?.avatar || activeApp?.patientAvatar;
  const displayName = patientProfile?.fullName || activeApp?.patient?.name || activeApp?.patientName;
  const displayGender = patientProfile?.gender || activeApp?.patientGender;
  const displayDob = patientProfile?.dateOfBirth || activeApp?.patientDob;

  return (
    <Grid item xs={3} sx={{ borderLeft: 1, borderColor: 'divider', bgcolor: 'white', height: '100%', overflowY: 'auto' }}>

      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
        <FileIcon color="action" fontSize="small" />
        <Typography variant="subtitle2">Hồ sơ bệnh án</Typography>
      </Box>
      {activeApp ? (
        <Box sx={{ p: 2 }}>
          {loadingProfile ? (
            <Box display="flex" gap={2} mb={3}>
              <Skeleton variant="circular" width={56} height={56} />
              <Box width="100%">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="50%" />
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                src={displayAvatar}
                alt={displayName}
                sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
              >
                {displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {displayName}
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <Chip
                    icon={displayGender?.toLowerCase() === 'female' ? <Female fontSize='small' /> : <Male fontSize='small' />}
                    label={displayGender?.toLowerCase() === 'female' ? 'Nữ' : 'Nam'}
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                  <Chip
                    label={`${calculateAge(displayDob)} tuổi`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />
          {loadingProfile ? (
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          ) : (
            <>
              <Box mb={2}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WarningIcon fontSize="inherit" color="error" /> Tiền sử dị ứng
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {patientProfile?.allergies && patientProfile.allergies.length > 0 ? (
                    patientProfile.allergies.map((item, idx) => (

                      <Chip
                        key={idx}
                        label={item.name || item}
                        color="error"
                        size="small"
                        variant="filled"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">Không ghi nhận dị ứng</Typography>
                  )}
                </Box>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
                  🏥 Bệnh lý nền
                </Typography>
                <Box mt={1}>
                  {patientProfile?.medicalConditions && patientProfile.medicalConditions.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.875rem', color: '#333' }}>
                      {patientProfile.medicalConditions.map((item, idx) => (
                        <li key={idx}>{item.name || item}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">Chưa có thông tin bệnh nền</Typography>
                  )}
                </Box>
              </Box>
            </>
          )}

          <Divider sx={{ mb: 2 }} />
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fffde7', borderColor: '#fff9c4' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
              Triệu chứng ban đầu
            </Typography>
            <Typography variant="body2" fontWeight="medium" color="error.main">
              {activeApp?.symptoms || "Không ghi nhận"}
            </Typography>
          </Paper>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>
              Thời gian hẹn
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {activeApp?.appointmentDate ? format(new Date(activeApp.appointmentDate), 'HH:mm - dd/MM/yyyy') : 'N/A'}
              </Typography>
            </Box>
          </Box>
          <TextField
            multiline rows={4} fullWidth placeholder="Ghi chú nhanh..."
            variant="outlined" size="small"
            sx={{ mb: 2, bgcolor: '#f9f9f9' }}
          />
          {activeApp?.status === 'completed' ? (
            <Button variant="outlined" color="success" fullWidth startIcon={<CheckCircle />} sx={{ cursor: 'default' }}>
              Đã hoàn thành khám
            </Button>
          ) : (
            <Button
              variant="contained" fullWidth disableElevation size="large" startIcon={<MedicalIcon />}
              onClick={() => setOpenPrescription(true)}
              sx={{ bgcolor: '#1976d2', py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Kê đơn & Hoàn thành
            </Button>
          )}

          <PrescriptionDialog
            open={openPrescription}
            onClose={() => setOpenPrescription(false)}
            appointment={activeApp}
            onSuccess={handlePrescriptionSuccess}
          />

        </Box>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', mt: 5 }}>
          <MedicalIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
          <Typography variant="body1">Chọn một bệnh nhân từ danh sách để bắt đầu khám</Typography>
        </Box>
      )}
    </Grid>
  );
}