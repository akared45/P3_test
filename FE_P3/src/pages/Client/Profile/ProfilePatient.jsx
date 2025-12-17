import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Person, History, AccountBalanceWallet } from '@mui/icons-material';
import { patientApi, uploadApi } from "../../../services/api";
import ProfileForm from "./ProfileForm";
import ConsultationHistory from "./ConsultationHistory"; // Import mới
import PaymentHistory from "./PaymentHistory"; // Import mới
import dayjs from "dayjs";
import { AuthContext } from "../../../providers/AuthProvider";

// Helper component cho TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProfilePatient = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); // State quản lý tab
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // --- LOGIC LOAD PROFILE CŨ GIỮ NGUYÊN ---
  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const { data } = await patientApi.getById(user.id);
        const userData = data.data || data;
        const phoneContact = userData.contacts?.find((c) => c.type === "phone");

        const formattedData = {
          ...userData,
          dateOfBirth: userData.dateOfBirth
            ? dayjs(userData.dateOfBirth).format("YYYY-MM-DD")
            : "",
          medicalConditions: userData.medicalConditions || [],
          allergies: userData.allergies || [],
          phone: phoneContact ? phoneContact.value : "",
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

  // --- LOGIC UPDATE PROFILE CŨ GIỮ NGUYÊN ---
  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      let updatedContacts = [];
      if (profile?.contacts) {
        updatedContacts = profile.contacts.filter((c) => c.type !== "phone");
      }
      if (values.phone) {
        updatedContacts.push({
          type: "phone",
          value: values.phone,
          isPrimary: true,
        });
      }
      const payload = {
        fullName: values.fullName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        avatarUrl: values.avatarUrl,
        medicalConditions: values.medicalConditions,
        allergies: values.allergies,
        contacts: updatedContacts,
      };

      const res = await patientApi.updateMe(payload);
      setProfile({ ...values, contacts: updatedContacts });
      setNotification({
        open: true,
        message: "Cập nhật hồ sơ thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile", error);
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
      const detailError = error.response?.data?.errors?.[0];
      setNotification({
        open: true,
        message: detailError || errorMsg,
        severity: "error",
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
      setNotification({
        open: true,
        message: "Lỗi upload ảnh",
        severity: "error",
      });
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
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#1976d2" }}>
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Quản lý thông tin, lịch sử khám và thanh toán
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8faff' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            aria-label="profile tabs"
            sx={{
                '& .MuiTab-root': { py: 2, fontWeight: 600 },
                '& .Mui-selected': { color: '#1976d2' }
            }}
          >
            <Tab icon={<Person />} iconPosition="start" label="Thông tin cá nhân" />
            <Tab icon={<History />} iconPosition="start" label="Lịch sử khám" />
            <Tab icon={<AccountBalanceWallet />} iconPosition="start" label="Thanh toán" />
          </Tabs>
        </Box>

        <Box sx={{ p: isMobile ? 2 : 4 }}>
            <TabPanel value={tabValue} index={0}>
                {profile ? (
                    <ProfileForm
                        initialValues={profile}
                        onSubmit={handleUpdateProfile}
                        onUploadAvatar={handleUploadAvatar}
                    />
                ) : (
                    <Typography color="error">Không thể tải thông tin hồ sơ.</Typography>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <ConsultationHistory />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <PaymentHistory />
            </TabPanel>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: "80px" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePatient;