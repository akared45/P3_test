import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import { CalendarMonth, Payment } from "@mui/icons-material";
import BookingForm from "./BookingForm";
import PaymentPrompt from "./PaymentPrompt";
import { appointmentApi, paymentApi } from "../../../services/api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BookingDialog = ({ open, onClose, doctor }) => {
  const { t } = useTranslation("doctorcard");
  const navigate = useNavigate();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newAppointmentId, setNewAppointmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setBookingSuccess(false);
      setNewAppointmentId(null);
    }
  }, [open]);

  const handleBook = async (formData) => {
    setLoading(true);
    try {
      const res = await appointmentApi.book({
        doctorId: doctor.id || doctor._id,
        appointmentDate: formData.appointmentDate,
        symptoms: formData.symptoms,
        type: "CHAT",
      });

      const createdId = res.data?.data?.id || res.data?.id || res.data?._id;

      if (createdId) {
        setNewAppointmentId(createdId);
        setBookingSuccess(true);
      } else {
        alert(t("bookingSuccessNoId"));
        onClose();
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/dang-nhap");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

const handleVnPayPayment = async () => {
    if (!newAppointmentId) return;
    
    setPaymentLoading(true);
    const paymentWindow = window.open("", "_blank");
    if (paymentWindow) {
        paymentWindow.document.write(
            '<html><head><title>Thanh toán VNPAY</title></head><body><h3 style="text-align:center; margin-top: 50px; font-family: sans-serif;">Đang kết nối đến VNPAY, vui lòng chờ...</h3></body></html>'
        );
    }

    try {
      const res = await paymentApi.createVnPayUrl({ appointmentId: newAppointmentId });
      const responseData = res.data.data || res.data;
      let paymentUrl = "";

      if (typeof responseData === 'string') {
          paymentUrl = responseData;
      } else if (responseData?.payUrl) {
          paymentUrl = responseData.payUrl;
      }

      if (paymentUrl) {
        if (paymentWindow) {
            paymentWindow.location.href = paymentUrl;
        } else {
            window.open(paymentUrl, "_blank");
        }
      } else {
        paymentWindow?.close();
        alert(t("paymentLinkError") || "Không lấy được link thanh toán");
      }
    } catch (error) {
      console.error(error);
      paymentWindow?.close();
      alert("Lỗi kết nối cổng thanh toán VNPAY");
    } finally {
      setPaymentLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#f8f9fa", borderBottom: "1px solid #eee" }}>
        <Box display="flex" alignItems="center" gap={1}>
          {bookingSuccess ? (
            <Payment color="success" />
          ) : (
            <CalendarMonth color="primary" />
          )}
          {bookingSuccess ? t("paymentTitle") : t("bookingTitle")}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {bookingSuccess ? (
          <PaymentPrompt
            doctor={doctor}
            loading={paymentLoading}
            onPayment={handleVnPayPayment}
            onClose={onClose}
          />
        ) : (
          <BookingForm
            doctor={doctor}
            loading={loading}
            onSubmit={handleBook}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;