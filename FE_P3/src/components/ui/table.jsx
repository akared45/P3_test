import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const paginationModel = { page: 0, pageSize: 5 };

const Table = ({ columns, rows }) => {
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows || []}
        columns={columns || []}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

const TableBase = ({
  rows = [],
  columns = [],
  loading = false,
  rowHeight = 60,
  pageSizeOptions = [10, 20, 50],
  getRowId,
  height = "100%",
  sx = {},
  ...rest
}) => {
  return (
    <Paper sx={{ width: "100%", height, ...sx }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        rowHeight={rowHeight}
        pageSizeOptions={pageSizeOptions}
        sx={{ border: 0 }}
        {...rest}
      />
    </Paper>
  );
};

export { Table, TableBase };
