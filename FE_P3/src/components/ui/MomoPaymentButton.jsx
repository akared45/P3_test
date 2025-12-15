import React, { useState } from 'react';
import paymentApi from '../../services/api';
import { Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const MomoPaymentButton = ({ appointmentId }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            const res = await paymentApi.createMomoUrl(appointmentId);

            if (res && res.payUrl) {
                window.location.href = res.payUrl;
            } else {
                toast.error("Không lấy được link thanh toán");
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
            color="secondary" 
            onClick={handlePayment}
            disabled={loading}
            style={{ backgroundColor: '#A50064', color: 'white' }}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Thanh toán qua MoMo"}
        </Button>
    );
};

export default MomoPaymentButton;