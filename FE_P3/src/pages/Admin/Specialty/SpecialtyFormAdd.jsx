import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./style.module.scss";
import TextFields from "../../../components/ui/textFields";
import { specApi } from "../../../services/api";
const SpecialtyFormAdd = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      category: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Mã không được để trống"),
      name: Yup.string().required("Tên không được để trống"),
      category: Yup.string().required("Danh mục không được để trống"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          code: values.code,
          name: values.name,
          category: values.category,
        };
        const res = await specApi.addNew(payload);
        console.log("Update result:", res);
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Thêm chuyên khoa</h2>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <TextFields
            name="code"
            label="Mã"
            formik={formik}
            fullWidth
            size="small"
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialtyFormAdd;
