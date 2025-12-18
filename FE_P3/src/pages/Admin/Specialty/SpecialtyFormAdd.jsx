import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./style.module.scss";
import TextFields from "../../../components/ui/textFields";
import { specApi } from "../../../services/api";
import { useTranslation } from "react-i18next";

const SpecialtyFormAdd = ({ onClose }) => {
  const { t } = useTranslation("specialty");

  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      category: "",
    },

    validationSchema: Yup.object({
      code: Yup.string().required(t("form.validation.codeRequired")),
      name: Yup.string().required(t("form.validation.nameRequired")),
      category: Yup.string().required(t("form.validation.categoryRequired")),
    }),

    onSubmit: async (values) => {
      try {
        const payload = {
          code: values.code,
          name: values.name,
          category: values.category,
        };

        await specApi.addNew(payload);
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{t("form.addTitle")}</h2>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <TextFields
            name="code"
            label={t("form.fields.code")}
            formik={formik}
            fullWidth
            size="small"
          />

          <TextFields
            name="name"
            label={t("form.fields.name")}
            formik={formik}
            fullWidth
            size="small"
          />

          <TextFields
            name="category"
            label={t("form.fields.category")}
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
              {t("form.buttons.cancel")}
            </button>

            <button type="submit" className={styles.saveBtn}>
              {t("form.buttons.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialtyFormAdd;
