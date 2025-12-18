import React, { useEffect, useState } from "react";
import { TableBase } from "@components/ui/table";
import Modal from "@components/ui/modal";
import Button from "@components/ui/button";
import { specApi } from "../../../services/api";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import styles from "./style.module.scss";
import SpecialtyStatistic from "./SpecialtyStatistic";
import SpecialtyFormAdd from "./SpecialtyFormAdd";
import SpecialtyFormUpdate from "./SpecialtyFormUpdate";
import { useTranslation } from "react-i18next";

const Specialty = () => {
  const { t } = useTranslation("specialty");

  const [specialty, setSpecialty] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalSpec = specialty.length;

  const fetchSpecialty = async () => {
    try {
      const res = await specApi.getAll();
      setSpecialty(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSpecialty();
  }, []);

  const handleOpenDelete = (row) => {
    setSelectedItem(row);
    setOpenDelete(true);
  };

  const handleOpenUpdate = (row) => {
    setSelectedItem(row);
    setOpenUpdate(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await specApi.delete(selectedItem.code);
      setOpenDelete(false);
      fetchSpecialty();
    } catch (error) {
      console.log(error);
    }
  };

  const specialtyColumns = [
    { field: "code", headerName: t("table.code"), width: 150 },
    { field: "name", headerName: t("table.name"), width: 220 },
    { field: "category", headerName: t("table.category"), width: 180 },
    {
      field: "actions",
      headerName: t("table.actions"),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <CreateOutlinedIcon
            style={{ cursor: "pointer", color: "#1976d2" }}
            onClick={() => handleOpenUpdate(params.row)}
          />
          <DeleteOutlineOutlinedIcon
            style={{ cursor: "pointer", color: "#d32f2f" }}
            onClick={() => handleOpenDelete(params.row)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {openCreate && (
        <SpecialtyFormAdd
          onClose={() => {
            setOpenCreate(false);
            fetchSpecialty();
          }}
        />
      )}

      {openUpdate && (
        <SpecialtyFormUpdate
          initialData={selectedItem}
          onClose={() => {
            setOpenUpdate(false);
            fetchSpecialty();
          }}
        />
      )}

      {openDelete && (
        <Modal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          title={t("modal.deleteTitle")}
          message={t("modal.deleteMessage", {
            name: selectedItem?.name,
          })}
          onConfirm={handleConfirmDelete}
        />
      )}

      <div className={styles.spec__head}>
        <h4>{t("title")}</h4>
        <div style={{ width: "250px" }}>
          <Button
            content={t("addButton")}
            onClick={() => setOpenCreate(true)}
          />
        </div>
      </div>

      <div className={styles.spec__wrapper}>
        <TableBase
          rows={specialty}
          columns={specialtyColumns}
          getRowId={(row) => row.code}
        />
        <div>
          <SpecialtyStatistic value={totalSpec} />
        </div>
      </div>
    </>
  );
};

export default Specialty;
