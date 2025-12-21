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
import { useTranslation } from "react-i18next";

const CreateDoctorDialog = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation("admin_doctors"); // namespace mới
  const { addDoctor } = useContext(UserContext);
  const fileInputRef = useRef(null);

  const DAYS_OF_WEEK = [
    { value: "Monday", label: t("form.daysOfWeek.Monday") },
    { value: "Tuesday", label: t("form.daysOfWeek.Tuesday") },
    { value: "Wednesday", label: t("form.daysOfWeek.Wednesday") },
    { value: "Thursday", label: t("form.daysOfWeek.Thursday") },
    { value: "Friday", label: t("form.daysOfWeek.Friday") },
    { value: "Saturday", label: t("form.daysOfWeek.Saturday") },
    { value: "Sunday", label: t("form.daysOfWeek.Sunday") },
  ];

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
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
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

    if (!username || !email || !password || !fullName || !specCode) {
      showNotification(t("form.notifications.validationError"), "warning");
      return false;
    }

    for (const q of qualifications) {
      if (!q.degree || !q.institution || !q.year) {
        showNotification(t("form.notifications.validationError"), "warning");
        return false;
      }
    }

    for (const w of workHistory) {
      if (!w.position || !w.place || !w.from) {
        showNotification(t("form.notifications.validationError"), "warning");
        return false;
      }
    }

    for (const s of schedules) {
      if (!s.start || !s.end) {
        showNotification(t("form.notifications.validationError"), "warning");
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
      showNotification(t("form.notifications.addSuccess"), "success");
      onSuccess();
      onClose();
    } catch (err) {
      showNotification(
        err.response?.data?.message || t("form.notifications.addError"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textTransform: "uppercase",
          }}
        >
          {t("createDialogTitle")}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>
            {/* Avatar */}
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
                  {t("form.fields.avatar")}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  JPG, PNG. Max: 5MB
                </Typography>
              </Box>
            </Stack>

            {/* Thông tin cơ bản */}
            <Typography variant="h6" gutterBottom color="primary">
              {t("form.section.general")}
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
                  label="Password"
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
                  label={t("form.fields.fullName")}
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
                  label={t("form.fields.specCode")}
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
                  label={t("form.fields.licenseNumber")}
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" color="primary">
                {t("form.section.qualifications")}
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
                {t("form.buttons.add")}
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
                      label={t("form.fields.degree")}
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
                      label={t("form.fields.institution")}
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
                      label={t("form.fields.year")}
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

            {/* Quá trình công tác */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" color="primary">
                {t("form.section.workHistory")}
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
                {t("form.buttons.add")}
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
                      label={t("form.fields.position")}
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
                      label={t("form.fields.place")}
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
                      label={t("form.fields.from")}
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
                      label={t("form.fields.to")}
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

            {/* Lịch làm việc */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" color="primary">
                {t("form.section.schedules")}
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
                {t("form.buttons.add")}
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
                      label={t("form.fields.start")}
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
                      label={t("form.fields.end")}
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
                      label={t("form.fields.maxPatients")}
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
            {t("form.buttons.close")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? "..." : t("form.buttons.submit")}
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

export default CreateDoctorDialog;
