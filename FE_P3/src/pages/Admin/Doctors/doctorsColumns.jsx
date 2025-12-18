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
import { useTranslation } from "react-i18next";

export const getDoctorColumns = ({ handleOpenEdit, handleDelete }) => {
  const { t } = useTranslation("admin_doctors");

  return [
    {
      field: "doctorInfo",
      headerName: t("form.fields.fullName"),
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
      headerName: t("form.fields.specCode"),
      flex: 2,
      minWidth: 320,
      renderCell: (params) => (
        <Box>
          <Typography fontWeight={500}>{params.row.specialization}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t("form.fields.licenseNumber")}: {params.row.licenseNumber}
          </Typography>
        </Box>
      ),
    },
    {
      field: "experience",
      headerName: t("experience") || "Kinh nghiệm",
      flex: 1,
      minWidth: 130,
      align: "center",
      renderCell: (params) => (
        <Box textAlign="center">
          <Typography color="primary" fontWeight={700}>
            {params.row.yearsExperience} {t("years") || "năm"}
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
      headerName: t("status") || "Trạng thái",
      flex: 1,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ? t("statusActive") : t("statusInactive")}
          color={params.value ? "success" : "error"}
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: t("actions"),
      width: 130,
      align: "center",
      renderCell: (params) => (
        <>
          <Tooltip title={t("edit")}>
            <IconButton
              color="primary"
              onClick={() => handleOpenEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("delete")}>
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
};
