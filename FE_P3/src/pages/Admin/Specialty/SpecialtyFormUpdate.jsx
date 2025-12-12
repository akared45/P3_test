import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./style.module.scss";
import TextFields from "../../../components/ui/textFields";
import { specApi } from "../../../services/api";

const SpecialtyFormUpdate = ({ onClose, initialData }) => {
  const formik = useFormik({
    initialValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      category: initialData?.category || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Tên không được để trống"),
      category: Yup.string().required("Danh mục không được để trống"),
    }),
    onSubmit: async (values) => {
      try {
        const { code, name, category } = values;
        const res = await specApi.update(code, {
          name,
          category
        });
        onClose();
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Cập nhật chuyên khoa</h2>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <TextFields
            name="code"
            label="Mã"
            formik={formik}
            fullWidth
            size="small"
            disabled
          />

          <TextFields
            name="name"
            label="Tên"
            formik={formik}
            fullWidth
            size="small"
          />

          <TextFields
            name="category"
            label="Danh mục"
            formik={formik}
            fullWidth
            size="small"
          />

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className={styles.saveBtn}>
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialtyFormUpdate;
