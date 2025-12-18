import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { UserContext } from "@providers/UserProvider";
import { useTranslation } from "react-i18next";

const Patients = () => {
  const { t } = useTranslation("admin_patients");
  const { patients, loadingPatients, refreshPatients, deletePatient } =
    useContext(UserContext);
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    refreshPatients();
  }, []);

  useEffect(() => {
    if (!patients) return;
    const mapped = patients.map((p) => ({
      id: p.id,
      fullName: p.fullName || t("fullName.not_available"),
      email: p.email || "",
      gender:
        p.gender === "Male"
          ? t("gender.male")
          : p.gender === "Female"
          ? t("gender.female")
          : t("gender.other"),
      dateOfBirth: p.dateOfBirth
        ? new Date(p.dateOfBirth).toLocaleDateString("vi-VN")
        : t("dob.not_available"),
    }));
    setRows(mapped);
  }, [patients, t]);

  const handleDelete = async (id) => {
    if (!window.confirm(t("actions.confirm_delete"))) return;

    try {
      await deletePatient(id);
    } catch (error) {
      console.error(error);
      alert(t("actions.delete_failed"));
    }
  };

  const filteredRows = rows.filter(
    (row) =>
      row.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      row.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: t("columns.id"), width: 90 },
    {
      field: "fullName",
      headerName: t("columns.fullName"),
      flex: 1,
      minWidth: 180,
    },
    { field: "email", headerName: t("columns.email"), flex: 1, minWidth: 220 },
    {
      field: "gender",
      headerName: t("columns.gender"),
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dateOfBirth",
      headerName: t("columns.dateOfBirth"),
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "actions",
      headerName: t("columns.actions"),
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={t("actions.delete")}>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer
      sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
      />
      <TextField
        size="small"
        placeholder={t("search.placeholder")}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ width: 300, bgcolor: "white" }}
      />
    </GridToolbarContainer>
  );

  return (
    <Box
      sx={{ p: 3, height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          {t("header.title")}
        </Typography>
      </Box>

      <Paper
        sx={{
          flexGrow: 1,
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loadingPatients}
          getRowId={(row) => row.id}
          slots={{ toolbar: CustomToolbar }}
          disableRowSelectionOnClick
          pageSizeOptions={t("pagination.pageSizeOptions", {
            returnObjects: true,
          })}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f0f2f5",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#444",
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#f8f9fa" },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Patients;
