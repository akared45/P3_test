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
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (!open) return;
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
      arr[idx][key] = value;
      return { ...prev, [field]: arr };
    });

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert("Vui lòng nhập đủ thông tin bắt buộc!");
      return;
    }
    setLoading(true);
    try {
      let avatarUrl = "";
      if (selectedFile) {
        const res = await uploadApi.uploadImage(selectedFile);
        avatarUrl = res.data?.url || res.url;
      }
      await addDoctor({ ...formData, avatarUrl });
      alert("Thêm bác sĩ thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Thêm bác sĩ</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          {/* Avatar */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar src={previewUrl} sx={{ width: 100, height: 100 }}>
                {!previewUrl && (
                  <AccountCircle
                    sx={{ width: 80, height: 80, color: "#bdbdbd" }}
                  />
                )}
              </Avatar>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "white",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <CloudUpload />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="subtitle2">Ảnh đại diện</Typography>
              <Typography variant="caption" color="text.secondary">
                jpg/png/jpeg, max 5MB
              </Typography>
            </Box>
          </Stack>

          {/* Thông tin cơ bản */}
          <Typography variant="h6" gutterBottom>
            1. Thông tin cơ bản
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
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
                label="Số chứng chỉ"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Bằng cấp */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">2. Bằng cấp</Typography>
            <Button
              startIcon={<AddCircleOutline />}
              size="small"
              onClick={() =>
                addItem("qualifications", {
                  degree: "",
                  institution: "",
                  year: new Date().getFullYear(),
                })
              }
            >
              Thêm
            </Button>
          </Box>
          {formData.qualifications.map((item, idx) => (
            <Paper key={idx} sx={{ p: 1, my: 1 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Bằng cấp"
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
                      changeItem("qualifications", idx, "year", e.target.value)
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

          <Divider sx={{ my: 2 }} />

          {/* Công tác */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">3. Quá trình công tác</Typography>
            <Button
              startIcon={<AddCircleOutline />}
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
              Thêm
            </Button>
          </Box>
          {formData.workHistory.map((item, idx) => (
            <Paper key={idx} sx={{ p: 1, my: 1 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Chức vụ"
                    size="small"
                    value={item.position}
                    onChange={(e) =>
                      changeItem("workHistory", idx, "position", e.target.value)
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
                    label="Từ"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={item.from ? item.from.split("T")[0] : ""}
                    onChange={(e) =>
                      changeItem("workHistory", idx, "from", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Đến"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={item.to ? item.to.split("T")[0] : ""}
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

          <Divider sx={{ my: 2 }} />

          {/* Lịch */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">4. Lịch làm việc</Typography>
            <Button
              startIcon={<AddCircleOutline />}
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
              Thêm
            </Button>
          </Box>
          {formData.schedules.map((item, idx) => (
            <Paper key={idx} sx={{ p: 1, my: 1 }}>
              <Grid container spacing={1} alignItems="center">
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
                    label="Max BN"
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
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang lưu..." : "Thêm bác sĩ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDoctorDialog;
