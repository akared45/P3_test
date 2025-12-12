import React from "react";
import {
  Stack,
  Box,
  Typography,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImageUrl } from "../../../utils/imageHelper";

export const getDoctorColumns = ({ handleOpenEdit, handleDelete }) => [
  {
    field: "doctorInfo",
    headerName: "Bác sĩ",
    flex: 2,
    minWidth: 320,
    renderCell: (params) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={getImageUrl(params.row.avatar)}>
          {params.row.fullName.charAt(0)}
        </Avatar>
        <Box>
          <Typography fontWeight={600}>{params.row.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: "specialization",
    headerName: "Chuyên khoa",
    flex: 2,
    minWidth: 320,
    renderCell: (params) => (
      <Box>
        <Typography fontWeight={500}>{params.row.specialization}</Typography>
        <Typography variant="body2" color="text.secondary">
          Mã số: {params.row.licenseNumber}
        </Typography>
      </Box>
    ),
  },
  {
    field: "experience",
    headerName: "Kinh nghiệm",
    flex: 1,
    minWidth: 130,
    align: "center",
    renderCell: (params) => (
      <Box textAlign="center">
        <Typography color="primary" fontWeight={700}>
          {params.row.yearsExperience} năm
        </Typography>
        <Rating
          value={params.row.rating}
          readOnly
          size="small"
          precision={0.5}
        />
      </Box>
    ),
  },
  {
    field: "isActive",
    headerName: "Trạng thái",
    flex: 1,
    align: "center",
    renderCell: (params) => (
      <Chip
        label={params.value ? "Hoạt động" : "Đã khóa"}
        color={params.value ? "success" : "error"}
        variant="outlined"
      />
    ),
  },
  {
    field: "actions",
    headerName: "Thao tác",
    width: 130,
    align: "center",
    renderCell: (params) => (
      <>
        <Tooltip title="Chỉnh sửa">
          <IconButton
            color="primary"
            onClick={() => handleOpenEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Xóa">
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];
