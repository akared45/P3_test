import React from "react";
import { Grid, TextField, MenuItem } from "@mui/material";

const BasicInfo = ({ formik, isEditing }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Họ và tên"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.fullName && Boolean(errors.fullName)}
          helperText={touched.fullName && errors.fullName}
          disabled={!isEditing}
          variant={isEditing ? "outlined" : "filled"}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={values.email}
          disabled 
          variant="filled"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Số điện thoại"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone && Boolean(errors.phone)}
          helperText={touched.phone && errors.phone}
          disabled={!isEditing}
          variant={isEditing ? "outlined" : "filled"}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          select
          label="Giới tính"
          name="gender"
          value={values.gender}
          onChange={handleChange}
          disabled={!isEditing}
          variant={isEditing ? "outlined" : "filled"}
        >
          <MenuItem value="Male">Nam</MenuItem>
          <MenuItem value="Female">Nữ</MenuItem>
          <MenuItem value="Other">Khác</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Ngày sinh"
          name="dateOfBirth"
          type="date"
          value={values.dateOfBirth}
          onChange={handleChange}
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
          variant={isEditing ? "outlined" : "filled"}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfo;