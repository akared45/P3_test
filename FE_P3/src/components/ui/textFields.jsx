import React from "react";
import TextField from "@mui/material/TextField";

const TextFields = ({
  type = "text",
  label,
  name,
  formik,
  value,
  onChange,
  onBlur,
  ...props
}) => {
  const isErr = formik?.touched?.[name] && formik?.errors?.[name];
  const messageError = formik?.errors?.[name];

  return (
    <>
      <TextField
        name={name}
        type={type}
        label={label}
        value={formik ? formik.values[name] : value || ""}
        onChange={formik ? formik.handleChange : onChange}
        onBlur={formik ? formik.handleBlur : onBlur}
        {...props}
      />
      {isErr && <div style={{ color: "red" }}>{messageError}</div>}
    </>
  );
};

export default TextFields;
