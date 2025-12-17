import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./style.module.scss";
import TextFields from "../../../components/ui/textFields";
import { specApi } from "../../../services/api";
import { useTranslation } from "react-i18next";

const SpecialtyFormUpdate = ({ onClose, initialData }) => {
  const { t } = useTranslation("specialty");

  const formik = useFormik({
    initialValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      category: initialData?.category || "",
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      name: Yup.string().required(t("form.validation.nameRequired")),
      category: Yup.string().required(t("form.validation.categoryRequired")),
    }),

    onSubmit: async (values) => {
      try {
        const { code, name, category } = values;
        await specApi.update(code, { name, category });
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{t("form.updateTitle")}</h2>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <TextFields
            name="code"
            label={t("form.fields.code")}
            formik={formik}
            fullWidth
            size="small"
            disabled
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
              {t("form.buttons.update")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialtyFormUpdate;
