import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, Typography, Box, IconButton, Grid, Divider,
    Paper, InputAdornment, CircularProgress
} from '@mui/material';
import { AddCircle, Delete, Save, LocalPharmacy } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { appointmentApi, medicationApi } from '../../../services/api';
import MedicationListDialog from './MedicationListDialog'
const PrescriptionDialog = ({ open, onClose, appointment, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [allMedications, setAllMedications] = useState([]);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [activeRowIndex, setActiveRowIndex] = useState(null);
    const [symptoms, setSymptoms] = useState('');
    const [doctorNotes, setDoctorNotes] = useState('');
    const [medicines, setMedicines] = useState([
        { medicationId: '', drugName: '', dosage: { morning: 1, afternoon: 0, evening: 1 }, duration: 5, note: '' }
    ]);

    useEffect(() => {
        if (open) {
            setSymptoms(appointment?.symptoms || '');
            const fetchMeds = async () => {
                try {
                    const res = await medicationApi.getAll();
                    console.log(res);
                    setAllMedications(res.data.data || res.data || []);
                } catch (err) {
                    toast.error("Không thể tải danh mục thuốc");
                }
            };
            fetchMeds();
        }
    }, [open, appointment]);

    const addMedicineRow = () => {
        setMedicines([...medicines, { medicationId: '', drugName: '', dosage: { morning: 1, afternoon: 0, evening: 1 }, duration: 5, note: '' }]);
    };

    const removeMedicineRow = (index) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((_, i) => i !== index));
        } else {
            setMedicines([{ medicationId: '', drugName: '', dosage: { morning: 1, afternoon: 0, evening: 1 }, duration: 5, note: '' }]);
        }
    };

    const handleOpenCatalog = (index) => {
        setActiveRowIndex(index);
        setIsCatalogOpen(true);
    };

    const handleSelectMed = (med) => {
        const newList = [...medicines];
        newList[activeRowIndex].medicationId = med.id || med._id;
        newList[activeRowIndex].drugName = med.name;
        newList[activeRowIndex].note = med.usage?.instructions || '';
        setMedicines(newList);
        setIsCatalogOpen(false);
    };

    const updateDosage = (index, part, value) => {
        const newList = [...medicines];
        newList[index].dosage[part] = Number(value);
        setMedicines(newList);
    };

    const handleSubmit = async () => {
    // 1. Kiểm tra Lời dặn & Triệu chứng
    if (!symptoms.trim()) return toast.warning("Vui lòng nhập chẩn đoán/triệu chứng");
    if (!doctorNotes.trim()) return toast.warning("Vui lòng nhập lời dặn bác sĩ");

    // 2. Kiểm tra danh sách thuốc
    // Phải có ít nhất 1 loại thuốc
    const hasMedication = medicines.some(m => m.medicationId);
    if (!hasMedication) return toast.warning("Vui lòng chọn ít nhất một loại thuốc");

    // Kiểm tra tính đầy đủ của từng dòng thuốc đã chọn
    const isAnyMedIncomplete = medicines.some(med => {
        // Nếu đã chọn thuốc (có medicationId) thì phải điền đủ liều lượng và ngày
        if (med.medicationId) {
            const hasDosage = Number(med.dosage.morning) > 0 || 
                              Number(med.dosage.afternoon) > 0 || 
                              Number(med.dosage.evening) > 0;
            const hasDuration = Number(med.duration) > 0;
            
            return !hasDosage || !hasDuration;
        }
        return false;
    });

    if (isAnyMedIncomplete) {
        return toast.warning("Vui lòng điền đủ liều dùng và số ngày cho các thuốc đã chọn");
    }

    const validMeds = medicines.filter(m => m.medicationId);
    
    setLoading(true);
    try {
        for (const med of validMeds) {
            await medicationApi.addPrescription(appointment.id || appointment._id, {
                medicationId: med.medicationId,
                dosage: med.dosage,
                duration: med.duration,
                note: med.note,
                timing: "AFTER_MEAL"
            });
        }

        const mappedPrescriptions = validMeds.map(med => {
            const dailyTotal = Number(med.dosage.morning || 0) + 
                               Number(med.dosage.afternoon || 0) + 
                               Number(med.dosage.evening || 0);
            return {
                medicationId: med.medicationId,
                drugName: med.drugName,
                quantity: dailyTotal * Number(med.duration), 
                usage: med.note || `Sáng ${med.dosage.morning}, Trưa ${med.dosage.afternoon}, Tối ${med.dosage.evening}`,
                dosage: med.dosage,
                duration: med.duration
            };
        });

        await appointmentApi.complete(appointment.id || appointment._id, {
            symptoms,
            doctorNotes,
            prescriptions: mappedPrescriptions
        });

        toast.success("Đã kê đơn và kết thúc ca khám!");
        onSuccess?.();
        onClose(); }catch (error) {
            const warnings = error.response?.data?.warnings;
            if (warnings) {
                toast.error(`CẢNH BÁO AN TOÀN: ${warnings.join('. ')}`, { autoClose: false });
            } else {
                toast.error(error.response?.data?.message || "Lỗi khi lưu dữ liệu");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalPharmacy /> Khám Bệnh & Chỉ Định Đơn Thuốc
            </DialogTitle>

            <DialogContent dividers sx={{ bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>1. CHẨN ĐOÁN / TRIỆU CHỨNG</Typography>
                <TextField
                    fullWidth multiline rows={2} variant="outlined" sx={{ bgcolor: 'white', mb: 3 }}
                    value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Nhập chẩn đoán lâm sàng..."
                />

                <Divider sx={{ mb: 3 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2" fontWeight="bold">2. CHỈ ĐỊNH THUỐC</Typography>
                    <Button startIcon={<AddCircle />} onClick={addMedicineRow} variant="contained" size="small">Thêm thuốc</Button>
                </Box>

                {medicines.map((med, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, borderLeft: '4px solid #1976d2' }} elevation={1}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField
                                    fullWidth size="small" label="Tên thuốc"
                                    value={med.drugName}
                                    placeholder="Click nút bên phải để chọn thuốc"
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton color="primary" onClick={() => handleOpenCatalog(index)}>
                                                    <LocalPharmacy />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box display="flex" gap={1}>
                                    <TextField label="Sáng" type="number" size="small" value={med.dosage.morning} onChange={(e) => updateDosage(index, 'morning', e.target.value)} />
                                    <TextField label="Trưa" type="number" size="small" value={med.dosage.afternoon} onChange={(e) => updateDosage(index, 'afternoon', e.target.value)} />
                                    <TextField label="Tối" type="number" size="small" value={med.dosage.evening} onChange={(e) => updateDosage(index, 'evening', e.target.value)} />
                                </Box>
                            </Grid>
                            <Grid item xs={10} md={2}>
                                <TextField label="Ngày" type="number" size="small" fullWidth value={med.duration} onChange={(e) => {
                                    const newList = [...medicines];
                                    newList[index].duration = e.target.value;
                                    setMedicines(newList);
                                }} />
                            </Grid>
                            <Grid item xs={2} md={1} textAlign="right">
                                <IconButton color="error" onClick={() => removeMedicineRow(index)}><Delete /></IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth size="small" label="Hướng dẫn sử dụng"
                                    value={med.note} onChange={(e) => {
                                        const newList = [...medicines];
                                        newList[index].note = e.target.value;
                                        setMedicines(newList);
                                    }}
                                    placeholder="Ví dụ: Uống sau ăn 30 phút..."
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                ))}

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>3. LỜI DẶN BÁC SĨ</Typography>
                <TextField
                    fullWidth multiline rows={3} sx={{ bgcolor: 'white' }}
                    value={doctorNotes} onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Ghi chú dặn dò bệnh nhân, hẹn tái khám..."
                />
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: '#f0f4f8' }}>
                <Button onClick={onClose} disabled={loading}>Hủy bỏ</Button>
                <Button
                    variant="contained" color="success" size="large"
                    onClick={handleSubmit} disabled={loading}
                    startIcon={loading ? null : <Save />}
                >
                    {loading ? "Đang xử lý..." : "Xác nhận & Gửi đơn"}
                </Button>
            </DialogActions>

            <MedicationListDialog
    open={isCatalogOpen}
    onClose={() => setIsCatalogOpen(false)}
    medicationList={allMedications} 
    onSelect={handleSelectMed}
/>
        </Dialog>
    );
};

export default PrescriptionDialog;