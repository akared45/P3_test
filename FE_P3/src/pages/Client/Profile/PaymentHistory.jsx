import React, { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, Grid, Card, CardContent, Button,
    Divider, Chip, CircularProgress, Alert
} from '@mui/material';
import { Payment, History, ArrowForward, EventBusy } from '@mui/icons-material';
import dayjs from 'dayjs';
import { appointmentApi, paymentApi } from '../../../services/api';

const PaymentHistory = () => {
    const [unpaidItems, setUnpaidItems] = useState([]);
    const [paidItems, setPaidItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);

    // Hàm kiểm tra xem lịch hẹn có quá hạn không
    const isExpired = (dateString) => {
        return new Date() > new Date(dateString);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await appointmentApi.getMyAppointments();
                const allApps = res.data.data || res.data;
                
                // Lọc đơn chưa thanh toán
                const unpaid = allApps.filter(a =>
                    a.paymentStatus === 'UNPAID' &&
                    a.amount > 0 &&
                    a.status !== 'cancelled'
                );
                setUnpaidItems(unpaid);
                
                // Lọc đơn đã thanh toán
                const paid = allApps.filter(a => a.paymentStatus === 'PAID');
                setPaidItems(paid);

            } catch (error) {
                console.error("Lỗi data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePayNow = async (appointmentId) => {
        setPayingId(appointmentId);
        
        const paymentWindow = window.open('', '_blank');
        if (paymentWindow) {
            paymentWindow.document.write('<html><head><title>VNPAY</title></head><body><h3 style="text-align:center; margin-top: 50px; font-family: sans-serif;">Đang kết nối đến cổng VNPAY...</h3></body></html>');
        }

        try {            
            const res = await paymentApi.createVnPayUrl({ appointmentId });
            const responseData = res.data.data || res.data;
            const paymentUrl = typeof responseData === 'string' ? responseData : responseData?.payUrl;

            if (paymentUrl) {
                if (paymentWindow) {
                    paymentWindow.location.href = paymentUrl;
                } else {
                    window.open(paymentUrl, '_blank');
                }
            } else {
                paymentWindow?.close();
                alert("Lỗi: Server không trả về link thanh toán.");
            }
        } catch (error) {
            console.error("Lỗi tạo link:", error);
            paymentWindow?.close();
            alert("Không thể kết nối đến cổng thanh toán.");
        } finally {
            setPayingId(null);
        }
    };

    if (loading) return <Box p={3} textAlign="center"><CircularProgress /></Box>;

    return (
        <Box>
            <Box mb={4}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f' }}>
                    <Payment /> Cần thanh toán ({unpaidItems.length})
                </Typography>

                {unpaidItems.length > 0 ? (
                    <Grid container spacing={2}>
                        {unpaidItems.map((item) => {
                            const expired = isExpired(item.appointmentDate);
                            return (
                                <Grid item xs={12} md={6} key={item.id || item._id}>
                                    <Card sx={{ 
                                        borderLeft: expired ? '4px solid #9e9e9e' : '4px solid #d32f2f', 
                                        bgcolor: expired ? '#f5f5f5' : '#fff5f5',
                                        opacity: expired ? 0.8 : 1
                                    }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="start">
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold">Phí khám: {item.doctorName}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Ngày: {dayjs(item.appointmentDate).format("DD/MM/YYYY HH:mm")}
                                                    </Typography>
                                                    <Typography variant="h6" color="primary.main" mt={1}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                                                    </Typography>
                                                </Box>

                                                <Box>
                                                    {expired ? (
                                                        <Chip 
                                                            icon={<EventBusy />} 
                                                            label="Đã quá hạn" 
                                                            color="default" 
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ borderColor: '#9e9e9e', color: '#616161' }}
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            endIcon={payingId === (item.id || item._id) ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                                                            disabled={payingId === (item.id || item._id)}
                                                            onClick={() => handlePayNow(item.id || item._id)}
                                                        >
                                                            {payingId === (item.id || item._id) ? "Đang tạo..." : "Thanh toán ngay"}
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
                    <Alert severity="success" variant="outlined">Bạn không có khoản phí nào cần thanh toán.</Alert>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                    <History /> Lịch sử giao dịch
                </Typography>

                {paidItems.length === 0 ? (
                    <Typography color="text.secondary" fontStyle="italic">Chưa có giao dịch nào.</Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {paidItems.map(item => (
                            <Paper key={item.id || item._id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">Thanh toán phí khám - BS. {item.doctorName}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Mã GD: {item.transactionId || '---'} | Ngày: {dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm")}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        Phương thức: {item.paymentMethod || 'VNPAY'}
                                    </Typography>
                                </Box>
                                <Box textAlign="right">
                                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                                        + {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                                    </Typography>
                                    <Chip label="Thành công" color="success" size="small" sx={{ height: 20, fontSize: 10 }} />
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