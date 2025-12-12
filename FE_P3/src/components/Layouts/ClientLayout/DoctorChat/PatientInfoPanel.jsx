import {
  Box, Grid, Paper, Typography, TextField, Button
} from "@mui/material";
import {
  Description as FileIcon,
  AccessTime as TimeIcon,
  MedicalServices as MedicalIcon
} from "@mui/icons-material";

export default function PatientInfoPanel({ activeApp }) {
  return (
    <Grid item xs={3} sx={{ borderLeft: 1, borderColor: 'divider', bgcolor: 'white' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
        <FileIcon color="action" fontSize="small" />
        <Typography variant="subtitle2">Hồ sơ bệnh án</Typography>
      </Box>

      {activeApp ? (
        <Box sx={{ p: 2 }}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fffde7', borderColor: '#fff9c4' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
              Triệu chứng
            </Typography>
            <Typography variant="body2" fontWeight="medium" color="error.main">
              {activeApp.symptoms || "Không ghi nhận"}
            </Typography>
          </Paper>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>
              Thời gian hẹn
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {new Date(activeApp.appointmentDate).toLocaleString('vi-VN')}
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', mb: 1, display: 'block' }}>
            Ghi chú bác sĩ (Private)
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Ghi chú nhanh..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />

          <Button variant="contained" fullWidth disableElevation startIcon={<MedicalIcon fontSize="small" />}>
            Kê đơn thuốc
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="caption">Chọn bệnh nhân để xem chi tiết</Typography>
        </Box>
      )}
    </Grid>
  );
}