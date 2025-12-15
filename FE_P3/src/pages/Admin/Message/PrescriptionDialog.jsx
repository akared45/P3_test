import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    Grid,
    Divider,
    Paper
} from '@mui/material';
import {
    AddCircle,
    Delete,
    Medication,
    Save,
    LocalPharmacy
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { appointmentApi } from '../../../services/api';

const PrescriptionDialog = ({ open, onClose, appointment, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [symptoms, setSymptoms] = useState(appointment?.symptoms || '');
    const [doctorNotes, setDoctorNotes] = useState('');
    const [medicines, setMedicines] = useState([
        { drugName: '', quantity: '', usage: '' }
    ]);
    const addMedicineRow = () => {
        setMedicines([...medicines, { drugName: '', quantity: '', usage: '' }]);
    };
    const removeMedicineRow = (index) => {
        const newList = medicines.filter((_, i) => i !== index);
        setMedicines(newList);
    };
    const handleMedicineChange = (index, field, value) => {
        const newList = [...medicines];
        newList[index][field] = value;
        setMedicines(newList);
    };
    const handleSubmit = async () => {
        if (!doctorNotes.trim()) {
            return toast.warning("Vui lòng nhập lời dặn của bác sĩ!");
        }
        const validPrescriptions = medicines.filter(m => m.drugName && m.drugName.trim() !== '');
        const payload = {
            symptoms: symptoms,
            doctorNotes: doctorNotes,
            prescriptions: validPrescriptions
        };

        setLoading(true);
        try {
            await appointmentApi.complete(appointment.id || appointment._id, payload);
            toast.success("Đã hoàn thành khám và gửi đơn thuốc!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Lỗi kê đơn:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu đơn thuốc");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalPharmacy /> Kê Đơn Thuốc & Hoàn Thành
            </DialogTitle>

            <DialogContent dividers>
                <Box mb={3}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                        1. Chẩn đoán / Triệu chứng thực tế
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Chi tiết triệu chứng & Chẩn đoán"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Ví dụ: Sốt siêu vi ngày thứ 3, họng đỏ, phổi trong..."
                        variant="outlined"
                        sx={{ bgcolor: '#f5f5f5' }}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                            2. Chỉ định thuốc
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddCircle />}
                            onClick={addMedicineRow}
                            size="small"
                        >
                            Thêm thuốc
                        </Button>
                    </Box>

                    <Grid container spacing={1} sx={{ mb: 1, px: 1 }}>
                        <Grid item xs={1}><Typography variant="caption" fontWeight="bold">STT</Typography></Grid>
                        <Grid item xs={4}><Typography variant="caption" fontWeight="bold">Tên thuốc *</Typography></Grid>
                        <Grid item xs={2}><Typography variant="caption" fontWeight="bold">Số lượng *</Typography></Grid>
                        <Grid item xs={4}><Typography variant="caption" fontWeight="bold">Cách dùng *</Typography></Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>

                    {medicines.map((med, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 1, mb: 1, bgcolor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={1}>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        {index + 1}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth size="small"
                                        placeholder="VD: Paracetamol 500mg"
                                        value={med.drugName}
                                        onChange={(e) => handleMedicineChange(index, 'drugName', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth size="small"
                                        placeholder="VD: 10 viên"
                                        value={med.quantity}
                                        onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth size="small"
                                        placeholder="VD: Sáng 1, Tối 1 sau ăn"
                                        value={med.usage}
                                        onChange={(e) => handleMedicineChange(index, 'usage', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton
                                        color="error"
                                        onClick={() => removeMedicineRow(index)}
                                        disabled={medicines.length === 1 && (!med.drugName && !med.quantity)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}

                    {medicines.length === 0 && (
                        <Typography variant="body2" color="textSecondary" align="center" py={2}>
                            Chưa kê thuốc nào. Bấm "Thêm thuốc" nếu cần.
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                        3. Lời dặn của bác sĩ (Bắt buộc)
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Ghi chú / Lời dặn dò / Tái khám"
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        placeholder="Ví dụ: Nghỉ ngơi tuyệt đối, uống nhiều nước, quay lại bệnh viện nếu sốt cao không hạ..."
                        required
                        error={!doctorNotes && loading}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                <Button onClick={onClose} color="inherit" size="large">
                    Quay lại
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? null : <Save />}
                    size="large"
                    sx={{ px: 4, bgcolor: '#1976d2' }}
                >
                    {loading ? "Đang gửi đơn..." : "Hoàn thành & Gửi đơn"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PrescriptionDialog;