import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContext } from "@providers/ToastProvider";
import Button from "@components/ui/Button";
import TextFields from "@components/ui/TextFields";
import { authApi } from "@services/api";
import styles from "./Login/style.module.scss";
import Illustration from "@images/draw.png";
import { useTranslation } from "react-i18next";
const ForgotPassword = () => {
  const { t } = useTranslation("auth_register");
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("forgotPassword.validationEmailInvalid"))
        .required(t("forgotPassword.validationEmailRequired")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await authApi.forgotPassword(values);
        toast.success(t("forgotPassword.toastSuccess"));
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message || t("forgotPassword.toastError")
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.auth}>
      <div className={styles.auth__illustration}>
        <img src={Illustration} alt="Forgot Password Illustration" />
      </div>

      <div className={styles.auth__content}>
        <form className={styles.auth__form} onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {t("forgotPassword.title")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("forgotPassword.description")}
            </p>
          </div>

          <TextFields
            label={"Email"}
            type="text"
            id="email"
            name="email"
            placeholder="nhap-email-cua-ban@example.com"
            formik={formik}
          />

          <Button
            content={
              loading
                ? t("forgotPassword.buttonSubmitting")
                : t("forgotPassword.buttonSubmit")
            }
            type="submit"
            disabled={loading}
          />

          <div className={styles.auth__register}>
            <Link to="/dang-nhap" className={styles.auth__register_link}>
              &larr; {t("forgotPassword.linkBackToLogin")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
