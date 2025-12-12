import React from "react";
import {
    Box, Typography, Chip, Card, CardContent, Grid, Stack,
    Button, TextField, IconButton, MenuItem, Paper
} from "@mui/material";
import { FieldArray, getIn } from "formik";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningIcon from '@mui/icons-material/Warning';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from "dayjs";

const MedicalInfo = ({ formik, isEditing }) => {
    const { values, handleChange, handleBlur, errors, touched } = formik;

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32', mb: 2 }}>
                <MedicalServicesIcon /> Hồ sơ Y tế (Tự khai báo)
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" color="textSecondary" gutterBottom>
                        1. Tiền sử bệnh lý:
                    </Typography>

                    <FieldArray name="medicalConditions">
                        {({ push, remove }) => (
                            <Box>
                                {values.medicalConditions?.map((item, index) => {
                                    const fieldName = `medicalConditions[${index}]`;

                                    return (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            {isEditing ? (
                                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa', position: 'relative' }}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        <IconButton size="small" color="error" onClick={() => remove(index)}>
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    </Box>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth label="Tên bệnh lý" size="small"
                                                                name={`${fieldName}.name`}
                                                                value={item.name} onChange={handleChange} onBlur={handleBlur}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth select label="Trạng thái" size="small"
                                                                name={`${fieldName}.status`}
                                                                value={item.status} onChange={handleChange}
                                                            >
                                                                <MenuItem value="active">Đang điều trị</MenuItem>
                                                                <MenuItem value="chronic">Mãn tính</MenuItem>
                                                                <MenuItem value="cured">Đã khỏi</MenuItem>
                                                            </TextField>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth type="date" label="Ngày chẩn đoán" size="small"
                                                                InputLabelProps={{ shrink: true }}
                                                                name={`${fieldName}.diagnosedDate`}
                                                                value={item.diagnosedDate ? dayjs(item.diagnosedDate).format("YYYY-MM-DD") : ""}
                                                                onChange={handleChange}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth label="Phác đồ / Thuốc đang dùng" size="small"
                                                                name={`${fieldName}.treatmentPlan`}
                                                                value={item.treatmentPlan} onChange={handleChange}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth label="Ghi chú thêm" size="small" multiline rows={2}
                                                                name={`${fieldName}.notes`}
                                                                value={item.notes} onChange={handleChange}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            ) : (
                                                <Card variant="outlined" sx={{ bgcolor: '#f1f8e9' }}>
                                                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                                                            <Chip
                                                                label={item.status === 'chronic' ? 'Mãn tính' : item.status === 'active' ? 'Đang điều trị' : 'Đã khỏi'}
                                                                size="small"
                                                                color={item.status === 'chronic' ? 'warning' : item.status === 'active' ? 'error' : 'success'}
                                                            />
                                                        </Box>
                                                        <Typography variant="body2" mt={1}>
                                                            <strong>Chẩn đoán:</strong> {item.diagnosedDate ? dayjs(item.diagnosedDate).format("DD/MM/YYYY") : "N/A"}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Điều trị:</strong> {item.treatmentPlan || "Không có"}
                                                        </Typography>
                                                        {item.notes && (
                                                            <Typography variant="caption" display="block" color="textSecondary" mt={0.5}>
                                                                * {item.notes}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Box>
                                    );
                                })}

                                {isEditing && (
                                    <Button
                                        startIcon={<AddCircleOutlineIcon />}
                                        variant="dashed"
                                        sx={{ border: '1px dashed grey', width: '100%' }}
                                        onClick={() => push({ name: "", status: "active", diagnosedDate: "", treatmentPlan: "", notes: "" })}
                                    >
                                        Thêm bệnh lý
                                    </Button>
                                )}

                                {!isEditing && values.medicalConditions?.length === 0 && (
                                    <Typography variant="body2" fontStyle="italic" color="textSecondary">Chưa có dữ liệu</Typography>
                                )}
                            </Box>
                        )}
                    </FieldArray>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <WarningIcon fontSize="small" color="error" /> 2. Dị ứng thuốc / Thực phẩm:
                    </Typography>

                    <FieldArray name="allergies">
                        {({ push, remove }) => (
                            <Box>
                                {values.allergies?.map((item, index) => {
                                    const fieldName = `allergies[${index}]`;
                                    return (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            {isEditing ? (
                                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff5f5', position: 'relative' }}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        <IconButton size="small" color="error" onClick={() => remove(index)}>
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    </Box>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField
                                                                fullWidth label="Tên dị ứng (Thuốc/TP)" size="small"
                                                                name={`${fieldName}.name`}
                                                                value={item.name} onChange={handleChange}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField
                                                                fullWidth select label="Mức độ" size="small"
                                                                name={`${fieldName}.severity`}
                                                                value={item.severity} onChange={handleChange}
                                                            >
                                                                <MenuItem value="low">Nhẹ</MenuItem>
                                                                <MenuItem value="medium">Trung bình</MenuItem>
                                                                <MenuItem value="high">Nghiêm trọng</MenuItem>
                                                            </TextField>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField
                                                                fullWidth label="Phản ứng (VD: Phát ban)" size="small"
                                                                name={`${fieldName}.reaction`}
                                                                value={item.reaction} onChange={handleChange}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth label="Ghi chú" size="small"
                                                                name={`${fieldName}.notes`}
                                                                value={item.notes} onChange={handleChange}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            ) : (

                                                null
                                            )}
                                        </Box>
                                    );
                                })}

                                {!isEditing && (
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        {values.allergies?.length > 0 ? values.allergies.map((item, index) => (
                                            <Chip
                                                key={index}
                                                label={`${item.name} (${item.reaction || '?'})`}
                                                color="error"
                                                variant="outlined"
                                                title={`Mức độ: ${item.severity}. Ghi chú: ${item.notes}`}
                                            />
                                        )) : (
                                            <Typography variant="body2" fontStyle="italic" color="textSecondary">Chưa có dữ liệu</Typography>
                                        )}
                                    </Stack>
                                )}

                                {isEditing && (
                                    <Button
                                        startIcon={<AddCircleOutlineIcon />}
                                        variant="dashed"
                                        sx={{ border: '1px dashed #d32f2f', color: '#d32f2f', width: '100%', mt: 1 }}
                                        onClick={() => push({ name: "", severity: "medium", reaction: "", notes: "" })}
                                    >
                                        Thêm dị ứng
                                    </Button>
                                )}
                            </Box>
                        )}
                    </FieldArray>
                </Grid>

            </Grid>
        </Box>
    );
};

export default MedicalInfo;