import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContext } from "@providers/ToastProvider";
import Button from "@components/ui/Button";
import TextFields from "@components/ui/TextFields";
import { authApi } from "@services/api";
import styles from "./Login/style.module.scss";
import Illustration from "@images/draw.png";
import { useTranslation } from "react-i18next";
const ResetPassword = () => {
  const { t } = useTranslation("auth_register");
  const navigate = useNavigate();
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, t("resetPassword.validationNewPasswordMin"))
        .required(t("resetPassword.validationNewPasswordRequired")),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), null],
          t("resetPassword.validationConfirmMismatch")
        )
        .required(t("resetPassword.validationConfirmRequired")),
    }),
    onSubmit: async (values) => {
      if (!token || !email) {
        toast.error(t("resetPassword.toastInvalidLink"));
        return;
      }

      setLoading(true);
      try {
        await authApi.resetPassword({
          token: token,
          email: email,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });

        toast.success(t("resetPassword.toastSuccess"));
        navigate("/dang-nhap");
      } catch (err) {
        console.error(err);
        const errorMsg =
          err.response?.data?.message || t("resetPassword.toastError");
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.auth}>
      <div className={styles.auth__illustration}>
        <img src={Illustration} alt="Reset Password Illustration" />
      </div>

      <div className={styles.auth__content}>
        <form className={styles.auth__form} onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {t("resetPassword.title")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("resetPassword.description")}
            </p>
          </div>

          <TextFields
            label={t("resetPassword.newPasswordLabel")}
            type="password"
            id="newPassword"
            name="newPassword"
            formik={formik}
          />

          <TextFields
            label={t("resetPassword.confirmPasswordLabel")}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            formik={formik}
          />

          <Button
            content={
              loading
                ? t("resetPassword.buttonSubmitting")
                : t("resetPassword.buttonSubmit")
            }
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
