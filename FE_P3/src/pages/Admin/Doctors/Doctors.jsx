import React, { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import Button from "@components/ui/button";
import { UserContext } from "@/providers/UserProvider";
import { TableBase } from "../../../components/ui/table";
import CreateDoctorDialog from "./CreateDoctorDialog";
import EditDoctorDialog from "./EditDoctorDialog";
import DoctorStatistic from "./DoctorStatistic";
import { formatDoctorRows } from "./formatDoctorRows";
import { getDoctorColumns } from "./doctorsColumns";
import { doctorApi } from "@services/api";
import Modal from "../../../components/ui/modal";

const Doctors = () => {
  const { doctors, loading, refreshDoctors } = useContext(UserContext);

  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  console.log(doctors);
  const handleOpenEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedDoctor(null);
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await doctorApi.delete(deleteId);
      alert("Xóa thành công!");
      refreshDoctors();
    } catch (error) {
      alert("Xóa thất bại!");
    } finally {
      setOpenDeleteModal(false);
      setDeleteId(null);
    }
  };

  const rows = formatDoctorRows(doctors);
  const columns = getDoctorColumns({
    handleOpenEdit,
    handleDelete: handleOpenDelete,
  });

  return (
    <>
      <Box sx={{ p: 3, height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box >
          <Typography variant="h4">Danh sách Bác sĩ</Typography>
          
        </Box>
        <Box my={3} sx={{ display: "flex", justifyContent: "space-between" , alignItems:"center"}}>
          <DoctorStatistic />
          <div style={{ width: "250px" }}>
            <Button
              content="+ Thêm bác sĩ"
              variant="contained"
              onClick={() => setOpenCreate(true)}
            />
          </div>
        </Box>
        <Box>
          {/* Bảng danh sách */}
          <Box sx={{ flexGrow: 1, backgroundColor: "white", borderRadius: 3 }}>
            <TableBase
              rows={rows}
              columns={columns}
              loading={loading}
              getRowId={(r) => r.id}
              pageSizeOptions={[10, 20, 50]}
              rowHeight={70}
            />
          </Box>

          {/* Dialog tạo bác sĩ */}
          <CreateDoctorDialog
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onSuccess={refreshDoctors}
          />

          {/* Dialog sửa bác sĩ */}
          <EditDoctorDialog
            open={openEdit}
            onClose={handleCloseEdit}
            doctorData={selectedDoctor} // truyền object đầy đủ
            onSuccess={refreshDoctors}
          />

          {/* Thống kê */}

        </Box>

        {/* Modal xác nhận xóa */}
        <Modal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa bác sĩ này không?"
          onConfirm={handleConfirmDelete}
        />
      </Box>
    </>
  );
};

export default Doctors;
