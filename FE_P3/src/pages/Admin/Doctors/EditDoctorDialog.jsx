import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  Avatar,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AddCircleOutline,
  DeleteOutline,
  CloudUpload,
  AccountCircle,
} from "@mui/icons-material";
import { doctorApi, specApi, uploadApi } from "@services/api";
import { getImageUrl } from "@utils/imageHelper";

const DAYS_OF_WEEK = [
  { value: "Monday", label: "Thứ 2" },
  { value: "Tuesday", label: "Thứ 3" },
  { value: "Wednesday", label: "Thứ 4" },
  { value: "Thursday", label: "Thứ 5" },
  { value: "Friday", label: "Thứ 6" },
  { value: "Saturday", label: "Thứ 7" },
  { value: "Sunday", label: "Chủ nhật" },
];

const EditDoctorDialog = ({ open, onClose, doctorData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // State quản lý lỗi
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    licenseNumber: "",
    specCode: "",
    isActive: true,
    qualifications: [],
    workHistory: [],
    schedules: [],
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    if (open && doctorData.id) {
      const fetchData = async () => {
        try {
          const [specsRes, doctorRes] = await Promise.all([
            specApi.getAll(),
            doctorApi.getById(doctorData.id),
          ]);
          const specs = specsRes.data || specsRes;
          setSpecializations(specs);
          const doc = doctorRes.data || doctorRes;
          setFormData({
            fullName: doc.fullName || "",
            licenseNumber: doc.licenseNumber || "",
            specCode: doc.specialization?.code || doc.specCode || "",
            isActive: doc.isActive,
            qualifications: doc.qualifications || [],
            schedules: doc.schedules || [],
            workHistory: (doc.workHistory || []).map((w) => ({
              ...w,
              from: w.from ? w.from.split("T")[0] : "",
              to: w.to ? w.to.split("T")[0] : "",
            })),
            avatarUrl: doc.avatarUrl || "",
          });
          if (doc.avatarUrl) {
            setPreviewUrl(getImageUrl(doc.avatarUrl));
          } else {
            setPreviewUrl("");
          }
          setSelectedFile(null);
          setErrors({}); // Reset lỗi khi mở form mới
        } catch (error) {
          showNotification("Lỗi tải dữ liệu", "warning");
          onClose();
        }
      };
      fetchData();
    }
  }, [open, doctorData]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showNotification("Vui lòng chọn file ảnh", "warning");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi của trường đó khi người dùng nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // --- Logic cho Qualifications ---
  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { degree: "", institution: "", year: new Date().getFullYear() },
      ],
    }));
  };
  const removeQualification = (index) => {
    const newList = [...formData.qualifications];
    newList.splice(index, 1);
    setFormData((prev) => ({ ...prev, qualifications: newList }));
  };
  const changeQualification = (index, field, value) => {
    const newList = [...formData.qualifications];
    newList[index][field] = value;
    setFormData((prev) => ({ ...prev, qualifications: newList }));
  };

  // --- Logic cho Work History ---
  const addWorkHistory = () => {
    setFormData((prev) => ({
      ...prev,
      workHistory: [
        ...prev.workHistory,
        { position: "", place: "", from: "", to: "" },
      ],
    }));
  };
  const removeWorkHistory = (index) => {
    const newList = [...formData.workHistory];
    newList.splice(index, 1);
    setFormData((prev) => ({ ...prev, workHistory: newList }));
  };
  const changeWorkHistory = (index, field, value) => {
    const newList = [...formData.workHistory];
    newList[index][field] = value;
    setFormData((prev) => ({ ...prev, workHistory: newList }));
  };

  // --- Logic cho Schedules ---
  const addSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        { day: "Monday", start: "08:00", end: "12:00", maxPatients: 10 },
      ],
    }));
  };
  const removeSchedule = (index) => {
    const newList = [...formData.schedules];
    newList.splice(index, 1);
    setFormData((prev) => ({ ...prev, schedules: newList }));
  };
  const changeSchedule = (index, field, value) => {
    const newList = [...formData.schedules];
    newList[index][field] = value;
    setFormData((prev) => ({ ...prev, schedules: newList }));
  };

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = "Họ tên không được để trống";
    if (!formData.specCode) tempErrors.specCode = "Vui lòng chọn chuyên khoa";
    if (!formData.licenseNumber)
      tempErrors.licenseNumber = "Số chứng chỉ không được để trống";

    // Kiểm tra mảng qualifications
    formData.qualifications.forEach((q, index) => {
      if (!q.degree) tempErrors[`qual_degree_${index}`] = "Trống";
      if (!q.institution) tempErrors[`qual_inst_${index}`] = "Trống";
    });

    // Kiểm tra mảng schedules
    formData.schedules.forEach((s, index) => {
      if (!s.start) tempErrors[`sched_start_${index}`] = "Trống";
      if (!s.end) tempErrors[`sched_end_${index}`] = "Trống";
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification(
        "Vui lòng kiểm tra các trường thông tin màu đỏ",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      let currentAvatarUrl = formData.avatarUrl;
      if (selectedFile) {
        const uploadRes = await uploadApi.uploadImage(selectedFile);
        currentAvatarUrl = uploadRes.data?.url || uploadRes.url;
      }
      const payload = {
        ...formData,
        avatarUrl: currentAvatarUrl,
        workHistory: formData.workHistory.map((w) => ({
          ...w,
          to: w.to ? w.to : null,
        })),
      };
      await doctorApi.update(doctorData.id, payload);
      showNotification("Cập nhật thành công!", "success");
      onSuccess();
      onClose();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Lỗi cập nhật dữ liệu",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Chỉnh sửa thông tin Bác sĩ
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 1 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              1. Thông tin chung
            </Typography>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 100, height: 100, border: "3px solid #e0e0e0" }}
                >
                  {!previewUrl && (
                    <AccountCircle
                      sx={{ width: 80, height: 80, color: "#bdbdbd" }}
                    />
                  )}
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <IconButton
                  color="primary"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "white",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <CloudUpload />
                </IconButton>
              </Box>
              <Box>
                <Typography variant="subtitle2">Ảnh đại diện</Typography>
                <Typography variant="caption" color="text.secondary">
                  Thay đổi ảnh mới nếu cần.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ tên"
                  name="fullName"
                  value={formData.fullName}
                  disabled
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Chuyên khoa"
                  name="specCode"
                  value={formData.specCode}
                  error={!!errors.specCode}
                  helperText={errors.specCode}
                  onChange={handleChange}
                >
                  {specializations.map((s) => (
                    <MenuItem key={s.code} value={s.code}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Số chứng chỉ"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  label="Trạng thái"
                  name="isActive"
                  value={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value })
                  }
                >
                  <MenuItem value={true}>Hoạt động</MenuItem>
                  <MenuItem value={false}>Dừng hoạt động</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6" color="primary">
                2. Bằng cấp / Học vấn
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                onClick={addQualification}
                variant="outlined"
                size="small"
              >
                Thêm bằng cấp
              </Button>
            </Box>

            {formData.qualifications.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Tên bằng cấp"
                      size="small"
                      value={item.degree}
                      error={!!errors[`qual_degree_${index}`]}
                      onChange={(e) =>
                        changeQualification(index, "degree", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Nơi cấp"
                      size="small"
                      value={item.institution}
                      error={!!errors[`qual_inst_${index}`]}
                      onChange={(e) =>
                        changeQualification(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Năm"
                      type="number"
                      size="small"
                      value={item.year}
                      onChange={(e) =>
                        changeQualification(index, "year", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeQualification(index)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6" color="primary">
                3. Quá trình Công tác
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                onClick={addWorkHistory}
                variant="outlined"
                size="small"
              >
                Thêm công tác
              </Button>
            </Box>

            {formData.workHistory.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Chức vụ"
                      size="small"
                      value={item.position}
                      onChange={(e) =>
                        changeWorkHistory(index, "position", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Nơi làm việc"
                      size="small"
                      value={item.place}
                      onChange={(e) =>
                        changeWorkHistory(index, "place", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Từ ngày"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={item.from}
                      onChange={(e) =>
                        changeWorkHistory(index, "from", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Đến ngày"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={item.to}
                      onChange={(e) =>
                        changeWorkHistory(index, "to", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeWorkHistory(index)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6" color="primary">
                4. Lịch làm việc
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                onClick={addSchedule}
                variant="outlined"
                size="small"
              >
                Thêm lịch
              </Button>
            </Box>

            {formData.schedules.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      select
                      fullWidth
                      label="Thứ"
                      size="small"
                      value={item.day}
                      onChange={(e) =>
                        changeSchedule(index, "day", e.target.value)
                      }
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Bắt đầu"
                      type="time"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={item.start}
                      error={!!errors[`sched_start_${index}`]}
                      onChange={(e) =>
                        changeSchedule(index, "start", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Kết thúc"
                      type="time"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={item.end}
                      error={!!errors[`sched_end_${index}`]}
                      onChange={(e) =>
                        changeSchedule(index, "end", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Max BN"
                      type="number"
                      size="small"
                      value={item.maxPatients}
                      onChange={(e) =>
                        changeSchedule(index, "maxPatients", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeSchedule(index)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Đóng
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Đang xử lý..." : "Cập nhật thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setNotification({ ...notification, open: false })}
        sx={{ mt: "80px" }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditDoctorDialog;
