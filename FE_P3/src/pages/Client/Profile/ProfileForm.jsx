import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Box, Button, Divider } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import AvatarSection from "./AvatarSection";
import BasicInfo from "./BasicInfo";
import MedicalInfo from "./MedicalInfo";

const validationSchema = Yup.object({
    fullName: Yup.string()
        .required("Họ và tên là bắt buộc")
        .min(3, "Tên quá ngắn"),

    phone: Yup.string()
        .required("Số điện thoại là bắt buộc")
        .matches(/^[0-9+]{9,15}$/, "Số điện thoại không hợp lệ"),

    medicalConditions: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Tên bệnh lý bắt buộc"),
            status: Yup.string().oneOf(['active', 'chronic', 'cured']),
            diagnosedDate: Yup.date().nullable()
        })
    ),

    allergies: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Tên dị ứng bắt buộc"),
            severity: Yup.string().oneOf(['low', 'medium', 'high'])
        })
    )
});

const ProfileForm = ({ initialValues, onSubmit, onUploadAvatar }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, helpers) => {
                await onSubmit(values, helpers);
                setIsEditing(false);
            }}
        >
            {(formikProps) => (
                <Form>
                    <Grid container spacing={4}>
                        <Box display="flex" gap={3}>
                            <Box flex={4} display="flex" flexDirection="column" gap={2}>
                                <AvatarSection
                                    formik={formikProps}
                                    isEditing={isEditing}
                                    onUpload={onUploadAvatar}
                                />
                            </Box>

                            <Box flex={8}>
                                <BasicInfo
                                    formik={formikProps}
                                    isEditing={isEditing}
                                />
                                <Divider
                                    sx={{
                                        my: 2,
                                        borderColor: 'rgba(0,0,0,0.3)',
                                        borderBottomWidth: '2px'
                                    }}
                                />
                                <MedicalInfo
                                    formik={formikProps}
                                    isEditing={isEditing}
                                />
                                <Divider
                                    sx={{
                                        my: 2,
                                        borderColor: 'rgba(0,0,0,0.3)',
                                        borderBottomWidth: '2px'
                                    }}
                                />
                                <Box display="flex" justifyContent="flex-end" mb={2}>
                                    {!isEditing ? (
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    ) : (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<CancelIcon />}
                                                onClick={() => {
                                                    formikProps.resetForm();
                                                    setIsEditing(false);
                                                }}
                                            >
                                                Hủy
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<SaveIcon />}
                                                type="submit"
                                                disabled={formikProps.isSubmitting}
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default ProfileForm;