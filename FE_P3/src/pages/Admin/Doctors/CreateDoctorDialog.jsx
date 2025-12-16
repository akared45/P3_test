import React, { useState, useEffect, useRef, useContext } from "react";
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
import { uploadApi, specApi } from "@services/api";
import { UserContext } from "../../../providers/UserProvider";

const DAYS_OF_WEEK = [
  { value: "Monday", label: "Thứ 2" },
  { value: "Tuesday", label: "Thứ 3" },
  { value: "Wednesday", label: "Thứ 4" },
  { value: "Thursday", label: "Thứ 5" },
  { value: "Friday", label: "Thứ 6" },
  { value: "Saturday", label: "Thứ 7" },
  { value: "Sunday", label: "Chủ nhật" },
];

const AddDoctorDialog = ({ open, onClose, onSuccess }) => {
  const { addDoctor } = useContext(UserContext);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const initialForm = {
    username: "",
    email: "",
    password: "",
    fullName: "",
    licenseNumber: "",
    specCode: "",
    qualifications: [],
    workHistory: [],
    schedules: [],
    avatarUrl: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  useEffect(() => {
    if (!open) {
      // Reset form khi đóng dialog
      setFormData(initialForm);
      setPreviewUrl("");
      setSelectedFile(null);
      return;
    }
    specApi
      .getAll()
      .then((res) => {
        const specs = res.data || res;
        setSpecializations(specs);
        if (specs.length)
          setFormData((prev) => ({ ...prev, specCode: specs[0].code }));
      })
      .catch(console.error);
  }, [open]);

  // --- LOGIC VALIDATION ---
  const validateForm = () => {
    const {
      username,
      email,
      password,
      fullName,
      specCode,
      qualifications,
      workHistory,
      schedules,
    } = formData;

    // 1. Kiểm tra thông tin chính
    if (!username || !email || !password || !fullName || !specCode) {
      showNotification(
        "Vui lòng điền đầy đủ thông tin bắt buộc (Dấu *)",
        "warning"
      );
      return false;
    }

    // 2. Validate Bằng cấp
    for (const q of qualifications) {
      if (!q.degree || !q.institution || !q.year) {
        showNotification("Vui lòng nhập đầy đủ thông tin bằng cấp!", "warning");
        return false;
      }
    }

    // 3. Validate Quá trình công tác
    for (const w of workHistory) {
      if (!w.position || !w.place || !w.from) {
        showNotification("Vui lòng nhập đầy đủ thông tin công tác!", "warning");
        return false;
      }
      if (w.to && new Date(w.to) < new Date(w.from)) {
        showNotification(
          `Lỗi tại '${w.position}': Ngày kết thúc không thể trước ngày bắt đầu!`,
          "warning"
        );
        return false;
      }
    }

    // 4. Validate Lịch làm việc
    for (const s of schedules) {
      if (!s.start || !s.end) {
        showNotification(
          "Vui lòng nhập giờ bắt đầu và kết thúc cho lịch làm việc!",
          "warning"
        );
        return false;
      }
      if (s.start >= s.end) {
        showNotification(
          `Lỗi lịch ${s.day}: Giờ kết thúc phải sau giờ bắt đầu!`,
          "warning"
        );
        return false;
      }
    }

    return true;
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addItem = (field, defaultItem) =>
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultItem],
    }));
  const removeItem = (field, idx) =>
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  const changeItem = (field, idx, key, value) =>
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[idx] = { ...arr[idx], [key]: value };
      return { ...prev, [field]: arr };
    });

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let avatarUrl = "";
      if (selectedFile) {
        const res = await uploadApi.uploadImage(selectedFile);
        avatarUrl = res.data?.url || res.url;
      }
      await addDoctor({ ...formData, avatarUrl });
      showNotification("Thêm bác sĩ thành công!", "success");
      onSuccess();
      onClose();
    } catch (err) {
      showNotification(err.response?.data?.message || "Có lỗi xảy ra", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
          THÊM BÁC SĨ MỚI
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>
            {/* Avatar Section */}
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 120, height: 120, border: "2px solid #e0e0e0" }}
                >
                  {!previewUrl && (
                    <AccountCircle
                      sx={{ width: 100, height: 100, color: "#bdbdbd" }}
                    />
                  )}
                </Avatar>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <CloudUpload fontSize="small" />
                </IconButton>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Ảnh đại diện
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  Định dạng: JPG, PNG. Dung lượng tối đa: 5MB
                </Typography>
              </Box>
            </Stack>

            {/* 1. Thông tin cơ bản */}
            <Typography variant="h6" gutterBottom color="primary">
              1. Thông tin tài khoản & cơ bản
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  required
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  required
                  label="Mật khẩu"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  required
                  label="Họ tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Chuyên khoa"
                  name="specCode"
                  value={formData.specCode}
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
                  label="Số chứng chỉ hành nghề"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* 2. Bằng cấp */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" color="primary">
                2. Bằng cấp
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                variant="outlined"
                size="small"
                onClick={() =>
                  addItem("qualifications", {
                    degree: "",
                    institution: "",
                    year: new Date().getFullYear(),
                  })
                }
              >
                Thêm bằng cấp
              </Button>
            </Box>
            {formData.qualifications.map((item, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#fafafa" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Tên bằng cấp (VD: Thạc sĩ)"
                      size="small"
                      value={item.degree}
                      onChange={(e) =>
                        changeItem(
                          "qualifications",
                          idx,
                          "degree",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Nơi cấp"
                      size="small"
                      value={item.institution}
                      onChange={(e) =>
                        changeItem(
                          "qualifications",
                          idx,
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
                        changeItem(
                          "qualifications",
                          idx,
                          "year",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeItem("qualifications", idx)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* 3. Quá trình công tác */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" color="primary">
                3. Quá trình công tác
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                variant="outlined"
                size="small"
                onClick={() =>
                  addItem("workHistory", {
                    position: "",
                    place: "",
                    from: "",
                    to: "",
                  })
                }
              >
                Thêm công tác
              </Button>
            </Box>
            {formData.workHistory.map((item, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#fafafa" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Chức vụ"
                      size="small"
                      value={item.position}
                      onChange={(e) =>
                        changeItem(
                          "workHistory",
                          idx,
                          "position",
                          e.target.value
                        )
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
                        changeItem("workHistory", idx, "place", e.target.value)
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
                        changeItem("workHistory", idx, "from", e.target.value)
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
                        changeItem("workHistory", idx, "to", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeItem("workHistory", idx)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* 4. Lịch làm việc */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" color="primary">
                4. Lịch khám cố định
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                variant="outlined"
                size="small"
                onClick={() =>
                  addItem("schedules", {
                    day: "Monday",
                    start: "08:00",
                    end: "12:00",
                    maxPatients: 10,
                  })
                }
              >
                Thêm lịch
              </Button>
            </Box>
            {formData.schedules.map((item, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#fafafa" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={item.day}
                      onChange={(e) =>
                        changeItem("schedules", idx, "day", e.target.value)
                      }
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <MenuItem key={d.value} value={d.value}>
                          {d.label}
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
                      onChange={(e) =>
                        changeItem("schedules", idx, "start", e.target.value)
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
                      onChange={(e) =>
                        changeItem("schedules", idx, "end", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Số BN tối đa"
                      type="number"
                      size="small"
                      value={item.maxPatients}
                      onChange={(e) =>
                        changeItem(
                          "schedules",
                          idx,
                          "maxPatients",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeItem("schedules", idx)}
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
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? "Đang xử lý..." : "Lưu bác sĩ"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddDoctorDialog;
