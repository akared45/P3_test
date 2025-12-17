import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, 
  Button
} from '@mui/material';
import { CalendarMonth, AccessTime, Person } from '@mui/icons-material';
import dayjs from 'dayjs';
import { appointmentApi } from '../../../services/api'; 

const ConsultationHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await appointmentApi.getMyAppointments();
        console.log(res.data.data);
        const sorted = (res.data.data || res.data).sort((a, b) => 
          new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setAppointments(sorted);
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'confirmed': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'Đã hoàn thành';
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) return <Box p={3} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        Lịch sử khám bệnh
      </Typography>
      
      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography color="text.secondary">Bạn chưa có lịch sử khám bệnh nào.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f0f7ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bác sĩ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Loại hình</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarMonth fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {dayjs(row.appointmentDate).format("DD/MM/YYYY")}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                             {dayjs(row.startTime).format("HH:mm")} - {dayjs(row.endTime).format("HH:mm")}
                            </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" color="action"/>
                        <Typography variant="body2">{row.doctorName || row.doctor?.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.type === 'chat' ? 'Tư vấn Online' : 'Khám tại chỗ'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(row.status)} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ConsultationHistory;