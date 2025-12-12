import React, { useState } from "react";
import { Box, Avatar, IconButton, Typography, CircularProgress } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const AvatarSection = ({ formik, isEditing, onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const { values, setFieldValue } = formik;

    const getAvatarUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return "http://localhost:3000" + url;
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setFieldValue("avatarUrl", previewUrl);
        setUploading(true);
        try {
            const url = await onUpload(file);
            setFieldValue("avatarUrl", url);
        } catch (error) {
            alert("Lỗi upload ảnh");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={2} sx={{ borderRight: { md: '1px solid #e0e0e0' } }}>
            <Box position="relative">
                <Avatar
                    src={getAvatarUrl(values.avatarUrl)}
                    alt={values.fullName}
                    sx={{ width: 150, height: 150, mb: 2, boxShadow: 3 }}
                />
                {isEditing && (
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                        sx={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            bgcolor: "white",
                            "&:hover": { bgcolor: "#f5f5f5" },
                            boxShadow: 2
                        }}
                    >
                        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                        {uploading ? <CircularProgress size={24} /> : <PhotoCamera />}
                    </IconButton>
                )}
            </Box>
            <Typography variant="h6" fontWeight="bold" align="center">
                {values.fullName || "Chưa có tên"}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
                {values.id}
            </Typography>
        </Box>
    );
};

export default AvatarSection;