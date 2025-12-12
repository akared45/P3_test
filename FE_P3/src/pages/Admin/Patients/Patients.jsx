import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { UserContext } from "@providers/UserProvider";

const Patients = () => {
  const { patients, loadingPatients, refreshPatients, deletePatient } = useContext(UserContext);
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
console.log(UserContext);
  useEffect(() => {
    refreshPatients();
  }, []);

  useEffect(() => {
    if (!patients) return;
    const mapped = patients.map((p) => ({
      id: p.id,
      fullName: p.fullName || "Chưa cập nhật",
      email: p.email || "",
      gender: p.gender === "Male" ? "Nam" : p.gender === "Female" ? "Nữ" : "Khác",
      dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString("vi-VN") : "Chưa có",
    }));
    setRows(mapped);
  }, [patients]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bệnh nhân này không?")) return;

    try {
      await deletePatient(id);
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  };

  const filteredRows = rows.filter((row) =>
    row.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    row.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "Họ và tên", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    {
      field: "gender",
      headerName: "Giới tính",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    { field: "dateOfBirth", headerName: "Ngày sinh", width: 120, align: 'right', headerAlign: 'right' },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title="Xóa bệnh nhân">
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
      </Typography>

      <TextField
        size="small"
        placeholder="Tìm kiếm..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ width: 300, bgcolor: 'white' }}
      />
    </GridToolbarContainer>
  );

  return (
    <Box sx={{ p: 3, height: "100vh", display: "flex", flexDirection: "column" }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Quản lý Bệnh nhân
        </Typography>
      </Box>

      <Paper sx={{ flexGrow: 1, width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 3 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loadingPatients}
          getRowId={(row) => row.id}
          slots={{ toolbar: CustomToolbar }}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f0f2f5",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#444"
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f8f9fa"
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default Patients;