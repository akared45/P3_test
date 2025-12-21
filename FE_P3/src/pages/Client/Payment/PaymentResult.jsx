import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Button, Paper, CircularProgress, 
    Divider, Stack, Container 
} from '@mui/material';
import { CheckCircle, Error, ArrowBack, ReceiptLong } from '@mui/icons-material';
import { paymentApi } from '../../../services/api'; 

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState({
        success: false,
        message: '',
        data: null
    });

    const amount = searchParams.get('vnp_Amount');
    const orderInfo = searchParams.get('vnp_OrderInfo');

    useEffect(() => {
        const verifyAndUpdateStatus = async () => {
            try {
                const params = Object.fromEntries([...searchParams]);
                const response = await paymentApi.verifyVnPayReturn(params);
                if (response.status === 200 || response.data?.status === 'success') {
                    setResult({
                        success: true,
                        message: 'Thanh toán của bạn đã được hệ thống xác nhận thành công!',
                        data: params
                    });
                } else {
                    setResult({
                        success: false,
                        message: 'Xác thực giao dịch thất bại. Vui lòng liên hệ hỗ trợ.',
                        data: params
                    });
                }
            } catch (error) {
                console.error("Lỗi verify:", error);
                setResult({
                    success: false,
                    message: error.response?.data?.message || 'Không thể cập nhật trạng thái lịch hẹn.',
                    data: null
                });
            } finally {
                setLoading(false);
            }
        };

        if (searchParams.get('vnp_SecureHash')) {
            verifyAndUpdateStatus();
        } else {
            setLoading(false);
            setResult(prev => ({ ...prev, message: 'Dữ liệu thanh toán không hợp lệ.' }));
        }
    }, [searchParams]);

    const formatCurrency = (val) => {
        if (!val) return "0 ₫";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(val / 100);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <CircularProgress size={50} />
                <Typography sx={{ mt: 2 }}>Đang hoàn tất thủ tục thanh toán...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, bgcolor: result.success ? '#4caf50' : '#f44336' }} />

                {result.success ? (
                    <Box>
                        <CheckCircle sx={{ fontSize: 70, color: '#4caf50', mb: 2 }} />
                        <Typography variant="h4" fontWeight="800" color="#2e7d32" gutterBottom>
                            Thanh Toán Thành Công
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        <Error sx={{ fontSize: 70, color: '#f44336', mb: 2 }} />
                        <Typography variant="h4" fontWeight="800" color="#d32f2f" gutterBottom>
                            Giao Dịch Thất Bại
                        </Typography>
                    </Box>
                )}

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 2 }}>
                    {result.message}
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Stack spacing={2.5} sx={{ textAlign: 'left', mb: 4, bgcolor: '#f9f9f9', p: 2, borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Tổng tiền:</Typography>
                        <Typography fontWeight="700">{formatCurrency(amount)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Nội dung:</Typography>
                        <Typography fontWeight="600" sx={{ maxWidth: '60%', textAlign: 'right' }}>
                            {orderInfo?.replace(/_/g, ' ')}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Mã GD VNPAY:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {searchParams.get('vnp_TransactionNo') || '---'}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button 
                        variant="contained" 
                        startIcon={<ArrowBack />} 
                        onClick={() => navigate('/')}
                        sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Trang chủ
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<ReceiptLong />} 
                        onClick={() => navigate('/profile')} 
                        sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Xem lịch hẹn
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};

export default PaymentResult;