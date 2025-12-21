import React, { useState } from 'react';
import { paymentApi } from '../../services/api';
import { Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const VnPayPaymentButton = ({ appointmentId }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);
            const res = await paymentApi.createVnPayUrl({ appointmentId });
            const paymentUrl = res.data.data || res.data;

            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                toast.error("Không lấy được link thanh toán VNPAY");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Lỗi tạo thanh toán");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            onClick={handlePayment}
            disabled={loading}
            style={{ 
                backgroundColor: '#005baa', 
                color: 'white',
                fontWeight: 'bold'
            }}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Thanh toán qua VNPAY"}
        </Button>
    );
};

export default VnPayPaymentButton;