import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";

const MedicineForm = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
    genericName: "",
    drugClass: "",
    timing: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        name: initialData.name || "",
        genericName: initialData.genericName || "",
        drugClass: initialData.drugClass || "",
        timing: initialData.usage?.timing || "",
      });
    } else {
      setForm({
        code: "",
        name: "",
        genericName: "",
        drugClass: "",
        timing: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      code: form.code,
      name: form.name,
      genericName: form.genericName,
      drugClass: form.drugClass,
      usage: {
        timing: form.timing,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Cập nhật thuốc" : "Thêm thuốc"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Mã thuốc"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Tên thuốc"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Hoạt chất"
            name="genericName"
            value={form.genericName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Nhóm thuốc"
            name="drugClass"
            value={form.drugClass}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Thời điểm dùng"
            name="timing"
            value={form.timing}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="BEFORE_MEAL">Trước ăn</MenuItem>
            <MenuItem value="AFTER_MEAL">Sau ăn</MenuItem>
            <MenuItem value="ANYTIME">Bất kỳ</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicineForm;
