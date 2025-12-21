import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Payment, History, ArrowForward, EventBusy } from "@mui/icons-material";
import dayjs from "dayjs";
import { appointmentApi, paymentApi } from "../../../services/api";
import { useTranslation } from "react-i18next";

const PaymentHistory = () => {
  const { t } = useTranslation("profile_client");
  const [unpaidItems, setUnpaidItems] = useState([]);
  const [paidItems, setPaidItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const isExpired = (dateString) => {
    return new Date() > new Date(dateString);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await appointmentApi.getMyAppointments();
        const allApps = res.data.data || res.data;

        const unpaid = allApps.filter(
          (a) =>
            a.paymentStatus === "UNPAID" &&
            a.amount > 0 &&
            a.status !== "cancelled"
        );
        setUnpaidItems(unpaid);

        const paid = allApps.filter((a) => a.paymentStatus === "PAID");
        setPaidItems(paid);
      } catch (error) {
        console.error(t("paymentHistory.errors.fetchData"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handlePayNow = async (appointmentId) => {
    setPayingId(appointmentId);

    const paymentWindow = window.open("", "_blank");
    if (paymentWindow) {
      paymentWindow.document.write(
        `<html><head><title>VNPAY</title></head><body>
          <h3 style="text-align:center; margin-top:50px; font-family:sans-serif;">
            ${t("paymentHistory.errors.connectingGateway")}
          </h3>
        </body></html>`
      );
    }

    try {
      const res = await paymentApi.createVnPayUrl({ appointmentId });
      const responseData = res.data.data || res.data;
      const paymentUrl =
        typeof responseData === "string" ? responseData : responseData?.payUrl;

      if (paymentUrl) {
        paymentWindow
          ? (paymentWindow.location.href = paymentUrl)
          : window.open(paymentUrl, "_blank");
      } else {
        paymentWindow?.close();
        alert(t("paymentHistory.errors.noPaymentUrl"));
      }
    } catch (error) {
      console.error(error);
      paymentWindow?.close();
      alert(t("paymentHistory.errors.cannotConnect"));
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* UNPAID */}
      <Box mb={4}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#d32f2f",
          }}
        >
          <Payment />
          {t("paymentHistory.unpaid.title")} ({unpaidItems.length})
        </Typography>

        {unpaidItems.length > 0 ? (
          <Grid container spacing={2}>
            {unpaidItems.map((item) => {
              const expired = isExpired(item.appointmentDate);
              return (
                <Grid item xs={12} md={6} key={item.id || item._id}>
                  <Card
                    sx={{
                      borderLeft: expired
                        ? "4px solid #9e9e9e"
                        : "4px solid #d32f2f",
                      bgcolor: expired ? "#f5f5f5" : "#fff5f5",
                      opacity: expired ? 0.8 : 1,
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {t("paymentHistory.unpaid.fee")} {item.doctorName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t("paymentHistory.unpaid.date")}{" "}
                            {dayjs(item.appointmentDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </Typography>
                          <Typography variant="h6" color="primary.main" mt={1}>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.amount)}
                          </Typography>
                        </Box>

                        <Box>
                          {expired ? (
                            <Chip
                              icon={<EventBusy />}
                              label={t("paymentHistory.unpaid.expired")}
                              variant="outlined"
                              size="small"
                            />
                          ) : (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              endIcon={
                                payingId === (item.id || item._id) ? (
                                  <CircularProgress size={20} color="inherit" />
                                ) : (
                                  <ArrowForward />
                                )
                              }
                              disabled={payingId === (item.id || item._id)}
                              onClick={() => handlePayNow(item.id || item._id)}
                            >
                              {payingId === (item.id || item._id)
                                ? t("paymentHistory.unpaid.paying")
                                : t("paymentHistory.unpaid.payNow")}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Alert severity="success" variant="outlined">
            {t("paymentHistory.unpaid.empty")}
          </Alert>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* PAID */}
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#1976d2",
          }}
        >
          <History />
          {t("paymentHistory.paid.title")}
        </Typography>

        {paidItems.length === 0 ? (
          <Typography color="text.secondary" fontStyle="italic">
            {t("paymentHistory.paid.empty")}
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {paidItems.map((item) => (
              <Paper
                key={item.id || item._id}
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("paymentHistory.paid.paymentFor")} {item.doctorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("paymentHistory.paid.transactionCode")}{" "}
                    {item.transactionId || "---"} |{" "}
                    {t("paymentHistory.paid.date")}{" "}
                    {dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {t("paymentHistory.paid.method")}{" "}
                    {item.paymentMethod || "VNPAY"}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="success.main"
                  >
                    +
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.amount)}
                  </Typography>
                  <Chip
                    label={t("paymentHistory.paid.success")}
                    color="success"
                    size="small"
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentHistory;
