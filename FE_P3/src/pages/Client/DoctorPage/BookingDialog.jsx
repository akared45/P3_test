import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import { CalendarMonth, Payment } from "@mui/icons-material";
import BookingForm from "./BookingForm";
import PaymentPrompt from "./PaymentPrompt";
import { appointmentApi } from "../../../services/api";
import {paymentApi} from "../../../services/api";

const BookingDialog = ({ open, onClose, doctor }) => {
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
        type: 'CHAT'
      });

      const createdId = res.data?.data?.id || res.data?.id || res.data?._id;

      if (createdId) {
        setNewAppointmentId(createdId);
        setBookingSuccess(true); 
      } else {
        alert("Đặt lịch thành công nhưng lỗi ID.");
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + (error.response?.data?.message || "Đặt lịch thất bại"));
    } finally {
      setLoading(false);
    }
  };

  const handleMomoPayment = async () => {
    if (!newAppointmentId) return;
    setPaymentLoading(true);
    try {
      const res = await paymentApi.createMomoUrl(newAppointmentId);
      if (res && res.payUrl) {
        window.location.href = res.payUrl;
      } else {
        alert("Không lấy được link thanh toán MoMo");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi tạo thanh toán: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
        <Box display="flex" alignItems="center" gap={1}>
          {bookingSuccess ? <Payment color="success" /> : <CalendarMonth color="primary" />}
          {bookingSuccess ? "Thanh toán phí khám" : "Đặt lịch khám"}
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