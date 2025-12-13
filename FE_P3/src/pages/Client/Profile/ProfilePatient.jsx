import React, { useEffect, useState, useContext } from "react";
import { Box, CircularProgress, Container, Paper, Typography, Alert, Snackbar } from "@mui/material";
import { patientApi, uploadApi } from "../../../services/api";
import ProfileForm from "./ProfileForm";
import dayjs from "dayjs";
import { AuthContext } from "../../../providers/AuthProvider";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const { data } = await patientApi.getById(user.id);
        const userData = data.data || data;
        const phoneContact = userData.contacts?.find(c => c.type === 'phone');

        const formattedData = {
          ...userData,
          dateOfBirth: userData.dateOfBirth ? dayjs(userData.dateOfBirth).format("YYYY-MM-DD") : "",
          medicalConditions: userData.medicalConditions || [],
          allergies: userData.allergies || [],
          phone: phoneContact ? phoneContact.value : ""
        };

        setProfile(formattedData);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      let updatedContacts = [];
      if (profile?.contacts) {
        updatedContacts = profile.contacts.filter(c => c.type !== 'phone');
      }
      if (values.phone) {
        updatedContacts.push({
          type: 'phone',
          value: values.phone,
          isPrimary: true
        });
      }
      const payload = {
        fullName: values.fullName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        avatarUrl: values.avatarUrl,
        medicalConditions: values.medicalConditions,
        allergies: values.allergies,
        contacts: updatedContacts
      };

      const res = await patientApi.updateMe(payload);
      setProfile({ ...values, contacts: updatedContacts });
      setNotification({ open: true, message: "Cập nhật hồ sơ thành công!", severity: "success" });
    } catch (error) {
      console.error("Error updating profile", error);
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
      const detailError = error.response?.data?.errors?.[0];

      setNotification({
        open: true,
        message: detailError || errorMsg,
        severity: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadAvatar = async (file) => {
    try {
      const { data } = await uploadApi.uploadImage(file);
      return data.url || data.data.url;
    } catch (error) {
      setNotification({ open: true, message: "Lỗi upload ảnh", severity: "error" });
      throw error;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: '#1976d2' }}>
        Hồ sơ bệnh nhân
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {profile ? (
          <ProfileForm
            initialValues={profile}
            onSubmit={handleUpdateProfile}
            onUploadAvatar={handleUploadAvatar}
          />
        ) : (
          <Typography color="error">Không thể tải thông tin hồ sơ.</Typography>
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;