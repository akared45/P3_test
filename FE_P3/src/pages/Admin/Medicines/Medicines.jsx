import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { medicationApi } from "../../../services/api";
import MedicineForm from "./MedicineForm";
import { useTranslation } from "react-i18next";
const Medicines = () => {
  const { t } = useTranslation("admin_sidebar");
  const [medicines, setMedicines] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const fetchMedicine = async () => {
    try {
      const res = await medicationApi.getAll();
      setMedicines(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMedicine();
  }, []);

  const handleAdd = () => {
    setEditingMedicine(null);
    setOpenForm(true);
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setOpenForm(true);
  };

  const handleDeleteMedi = async (id) => {
    const confirm = window.confirm(t("medicines.confirm_delete"));
    if (!confirm) return;

    try {
      await medicationApi.delete(id);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error(error);
      alert(t("medicines.delete_error"));
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (editingMedicine) {
        await medicationApi.update(editingMedicine.id, data);
      } else {
        await medicationApi.create(data);
      }
      setOpenForm(false);
      fetchMedicine();
    } catch (error) {
      console.error(error);
      alert(t("medicines.save_error"));
    }
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            {t("medicines.title")}
          </Typography>

          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            {t("medicines.add_button")}
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>{t("medicines.table.index")}</b>
                </TableCell>
                <TableCell>
                  <b>{t("medicines.table.code")}</b>
                </TableCell>
                <TableCell>
                  <b>{t("medicines.table.name")}</b>
                </TableCell>
                <TableCell>
                  <b>{t("medicines.table.generic_name")}</b>
                </TableCell>
                <TableCell>
                  <b>{t("medicines.table.drug_class")}</b>
                </TableCell>
                <TableCell>
                  <b>{t("medicines.table.timing")}</b>
                </TableCell>
                <TableCell align="center">
                  <b>{t("medicines.table.action")}</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {medicines.map((medicine, index) => (
                <TableRow key={medicine.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{medicine.code}</TableCell>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.genericName}</TableCell>
                  <TableCell>{medicine.drugClass}</TableCell>
                  <TableCell>{medicine.usage?.timing}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(medicine)}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDeleteMedi(medicine.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {medicines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t("medicines.table.no_data")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* FORM */}
      <MedicineForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmitForm}
        initialData={editingMedicine}
      />
    </Box>
  );
};

export default Medicines;
