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
import { useTranslation } from "react-i18next";

const MedicineForm = ({ open, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation("admin_sidebar");
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
      <DialogTitle>
        {initialData ? t("title_update") : t("title_add")}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label={t("label_code")}
            name="code"
            value={form.code}
            onChange={handleChange}
            disabled={!!initialData}
            fullWidth
          />

          <TextField
            label={t("label_name")}
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label={t("label_generic_name")}
            name="genericName"
            value={form.genericName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label={t("label_drug_class")}
            name="drugClass"
            value={form.drugClass}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label={t("label_timing")}
            name="timing"
            value={form.timing}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="BEFORE_MEAL">{t("timing_before_meal")}</MenuItem>
            <MenuItem value="AFTER_MEAL">{t("timing_after_meal")}</MenuItem>
            <MenuItem value="ANYTIME">{t("timing_anytime")}</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("button_cancel")}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t("button_save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicineForm;
