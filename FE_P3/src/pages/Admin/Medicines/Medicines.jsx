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

const Medicines = () => {
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
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa thuốc này?");
    if (!confirm) return;

    try {
      await medicationApi.delete(id);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error(error);
      alert("Xóa thuốc thất bại");
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
      alert("Lưu thuốc thất bại");
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
            Quản lý thuốc
          </Typography>

          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Thêm thuốc
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>STT</b>
                </TableCell>
                <TableCell>
                  <b>Mã thuốc</b>
                </TableCell>
                <TableCell>
                  <b>Tên thuốc</b>
                </TableCell>
                <TableCell>
                  <b>Hoạt chất</b>
                </TableCell>
                <TableCell>
                  <b>Nhóm thuốc</b>
                </TableCell>
                <TableCell>
                  <b>Thời điểm dùng</b>
                </TableCell>
                <TableCell align="center">
                  <b>Hành động</b>
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
                    Không có dữ liệu
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
