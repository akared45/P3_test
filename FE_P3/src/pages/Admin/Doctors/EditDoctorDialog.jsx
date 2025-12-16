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
    setNotification({ open: true, message, severity });
  };

  const today = new Date().toISOString().split("T")[0];

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
          setPreviewUrl(doc.avatarUrl ? getImageUrl(doc.avatarUrl) : "");
          setSelectedFile(null);
          setErrors({});
        } catch (error) {
          showNotification("Lỗi tải dữ liệu", "warning");
          onClose();
        }
      };
      fetchData();
    }
  }, [open, doctorData, onClose]);

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = "Họ tên không được để trống";
    if (!formData.specCode) tempErrors.specCode = "Vui lòng chọn chuyên khoa";
    if (!formData.licenseNumber)
      tempErrors.licenseNumber = "Số chứng chỉ không được để trống";

    formData.qualifications.forEach((q, index) => {
      if (!q.degree)
        tempErrors[`qual_degree_${index}`] = "Tên bằng cấp không được để trống";
      if (!q.institution)
        tempErrors[`qual_inst_${index}`] = "Nơi cấp không được để trống";
      if (!q.year) tempErrors[`qual_year_${index}`] = "Năm không được để trống";
    });

    formData.workHistory.forEach((w, index) => {
      if (!w.position)
        tempErrors[`work_pos_${index}`] = "Chức vụ không được để trống";
      if (!w.place)
        tempErrors[`work_place_${index}`] = "Nơi làm việc không được để trống";
      if (!w.from)
        tempErrors[`work_from_${index}`] = "Ngày bắt đầu không được để trống";

      if (w.to) {
        if (w.to > today) {
          tempErrors[`work_to_${index}`] =
            "Ngày kết thúc không được ở tương lai";
        }
        if (w.from && w.to < w.from) {
          tempErrors[`work_to_${index}`] =
            "Ngày kết thúc phải sau ngày bắt đầu";
        }
      }
    });

    formData.schedules.forEach((s, index) => {
      if (!s.day) tempErrors[`sched_day_${index}`] = "Vui lòng chọn thứ";
      if (!s.start)
        tempErrors[`sched_start_${index}`] = "Giờ bắt đầu không được để trống";
      if (!s.end)
        tempErrors[`sched_end_${index}`] = "Giờ kết thúc không được để trống";
      if (!s.maxPatients || s.maxPatients <= 0)
        tempErrors[`sched_max_${index}`] = "Số BN phải lớn hơn 0";
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[fieldName];
        return newErrs;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const changeQualification = (index, field, value) => {
    const newList = [...formData.qualifications];
    newList[index][field] = value;
    setFormData((prev) => ({ ...prev, qualifications: newList }));
    clearError(`qual_${field === "institution" ? "inst" : field}_${index}`);
  };

  const changeWorkHistory = (index, field, value) => {
    const newList = [...formData.workHistory];
    newList[index][field] = value;
    setFormData((prev) => ({ ...prev, workHistory: newList }));

    const errorMap = {
      position: "pos",
      place: "place",
      from: "from",
      to: "to",
    };
    clearError(`work_${errorMap[field]}_${index}`);
  };

  const changeSchedule = (index, field, value) => {
    const newList = [...formData.schedules];
    newList[index][field] = value;
    setFormData((prev) => ({ ...prev, schedules: newList }));
    clearError(`sched_${field === "maxPatients" ? "max" : field}_${index}`);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification("Vui lòng kiểm tra lại thông tin", "error");
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
          to: w.to || null,
        })),
      };
      await doctorApi.update(doctorData.id, payload);
      showNotification("Cập nhật thành công!", "success");
      onSuccess();
      onClose();
    } catch (error) {
      showNotification("Lỗi cập nhật dữ liệu", "error");
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
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
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Chuyên khoa"
                  name="specCode"
                  value={formData.specCode}
                  onChange={handleChange}
                  error={!!errors.specCode}
                  helperText={errors.specCode}
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
                  onChange={handleChange}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6" color="primary">
                2. Bằng cấp / Học vấn
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    qualifications: [
                      ...p.qualifications,
                      {
                        degree: "",
                        institution: "",
                        year: new Date().getFullYear(),
                      },
                    ],
                  }))
                }
                variant="outlined"
                size="small"
              >
                Thêm
              </Button>
            </Box>
            {formData.qualifications.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Tên bằng cấp"
                      size="small"
                      value={item.degree}
                      error={!!errors[`qual_degree_${index}`]}
                      helperText={errors[`qual_degree_${index}`]}
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
                      helperText={errors[`qual_inst_${index}`]}
                      onChange={(e) =>
                        changeQualification(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Năm"
                      type="number"
                      size="small"
                      value={item.year}
                      error={!!errors[`qual_year_${index}`]}
                      helperText={errors[`qual_year_${index}`]}
                      onChange={(e) =>
                        changeQualification(index, "year", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        const nl = [...formData.qualifications];
                        nl.splice(index, 1);
                        setFormData((p) => ({ ...p, qualifications: nl }));
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6" color="primary">
                3. Quá trình Công tác
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    workHistory: [
                      ...p.workHistory,
                      { position: "", place: "", from: "", to: "" },
                    ],
                  }))
                }
                variant="outlined"
                size="small"
              >
                Thêm
              </Button>
            </Box>
            {formData.workHistory.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Chức vụ"
                      size="small"
                      value={item.position}
                      error={!!errors[`work_pos_${index}`]}
                      helperText={errors[`work_pos_${index}`]}
                      onChange={(e) =>
                        changeWorkHistory(index, "position", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Nơi làm việc"
                      size="small"
                      value={item.place}
                      error={!!errors[`work_place_${index}`]}
                      helperText={errors[`work_place_${index}`]}
                      onChange={(e) =>
                        changeWorkHistory(index, "place", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Từ ngày"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={item.from}
                      error={!!errors[`work_from_${index}`]}
                      helperText={errors[`work_from_${index}`]}
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
                      inputProps={{ max: today }}
                      value={item.to || ""}
                      error={!!errors[`work_to_${index}`]}
                      helperText={errors[`work_to_${index}`]}
                      onChange={(e) =>
                        changeWorkHistory(index, "to", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        const nl = [...formData.workHistory];
                        nl.splice(index, 1);
                        setFormData((p) => ({ ...p, workHistory: nl }));
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6" color="primary">
                4. Lịch làm việc
              </Typography>
              <Button
                startIcon={<AddCircleOutline />}
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    schedules: [
                      ...p.schedules,
                      {
                        day: "Monday",
                        start: "08:00",
                        end: "12:00",
                        maxPatients: 10,
                      },
                    ],
                  }))
                }
                variant="outlined"
                size="small"
              >
                Thêm
              </Button>
            </Box>
            {formData.schedules.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <TextField
                      select
                      fullWidth
                      label="Thứ"
                      size="small"
                      value={item.day}
                      error={!!errors[`sched_day_${index}`]}
                      helperText={errors[`sched_day_${index}`]}
                      onChange={(e) =>
                        changeSchedule(index, "day", e.target.value)
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
                      error={!!errors[`sched_start_${index}`]}
                      helperText={errors[`sched_start_${index}`]}
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
                      helperText={errors[`sched_end_${index}`]}
                      onChange={(e) =>
                        changeSchedule(index, "end", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="BN tối đa"
                      type="number"
                      size="small"
                      value={item.maxPatients}
                      error={!!errors[`sched_max_${index}`]}
                      helperText={errors[`sched_max_${index}`]}
                      onChange={(e) =>
                        changeSchedule(index, "maxPatients", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        const nl = [...formData.schedules];
                        nl.splice(index, 1);
                        setFormData((p) => ({ ...p, schedules: nl }));
                      }}
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
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditDoctorDialog;
