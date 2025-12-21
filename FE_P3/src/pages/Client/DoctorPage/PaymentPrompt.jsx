import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { CheckCircle, Payment } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
const PaymentPrompt = ({ doctor, onPayment, onClose, loading }) => {
  const { t } = useTranslation("admin_doctors");
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={3}
      className="fade-in"
    >
      <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        {t("payment.successTitle")}
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" mb={3}>
        {t("payment.confirmPayment")}
        <strong>{doctor?.profile?.fullName}</strong>.
      </Typography>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onPayment}
        disabled={loading}
        sx={{
          bgcolor: "#A50064",
          color: "#fff",
          mb: 2,
          "&:hover": { bgcolor: "#80004d" },
        }}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : <Payment />
        }
      >
        {loading ? t("payment.redirecting") : t("payment.payNow")}
      </Button>

      <Button
        variant="text"
        onClick={onClose}
        color="inherit"
        sx={{ textDecoration: "underline" }}
      >
        {t("payment.payLater")}
      </Button>
    </Box>
  );
};

export default PaymentPrompt;
