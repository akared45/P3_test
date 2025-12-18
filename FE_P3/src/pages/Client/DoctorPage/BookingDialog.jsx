import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import { CalendarMonth, Payment } from "@mui/icons-material";
import BookingForm from "./BookingForm";
import PaymentPrompt from "./PaymentPrompt";
import { appointmentApi } from "../../../services/api";
import { paymentApi } from "../../../services/api";
import { useTranslation } from "react-i18next";

const BookingDialog = ({ open, onClose, doctor }) => {
  const { t } = useTranslation("doctorcard");

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
      alert(
        t("bookingFailed") +
          ": " +
          (error.response?.data?.message || t("unknownError"))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMomoPayment = async () => {
    if (!newAppointmentId) return;
    setPaymentLoading(true);
    try {
      const res = await paymentApi.createMomoUrl(newAppointmentId);
      if (res?.data?.payUrl) {
        window.location.href = res.data.payUrl;
      } else {
        alert(t("paymentLinkError"));
      }
    } catch (error) {
      console.error(error);
      alert(
        t("paymentCreateError") +
          ": " +
          (error.response?.data?.message || t("unknownError"))
      );
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
            onPayment={handleMomoPayment}
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
