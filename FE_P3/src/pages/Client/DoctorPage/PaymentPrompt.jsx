import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { CheckCircle, Payment } from "@mui/icons-material";

const PaymentPrompt = ({ doctor, onPayment, onClose, loading }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={3} className="fade-in">
      <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Đặt lịch thành công!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" mb={3}>
        Vui lòng thanh toán để xác nhận lịch hẹn với Bác sĩ <strong>{doctor?.profile?.fullName}</strong>.
      </Typography>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onPayment}
        disabled={loading}
        sx={{
          bgcolor: '#A50064',
          color: '#fff',
          mb: 2,
          '&:hover': { bgcolor: '#80004d' }
        }}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Payment />}
      >
        {loading ? "Đang chuyển hướng..." : "Thanh toán ngay qua MoMo"}
      </Button>

      <Button
        variant="text"
        onClick={onClose}
        color="inherit"
        sx={{ textDecoration: 'underline' }}
      >
        Tôi sẽ thanh toán sau (Vào chi tiết lịch hẹn)
      </Button>
    </Box>
  );
};

export default PaymentPrompt;