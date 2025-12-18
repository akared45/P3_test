import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "@providers/AuthProvider";
import { ToastContext } from "@providers/ToastProvider";
import Button from "@components/ui/Button";
import TextFields from "@components/ui/TextFields";
import styles from "./style.module.scss";
import Illustration from "@images/draw.png";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation("auth_login");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("validationEmailInvalid"))
        .required(t("validationEmailRequired")),
      password: Yup.string()
        .min(6, t("validationPasswordMin"))
        .required(t("validationPasswordRequired")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const user = await login(values);
        toast.success(t("toastSuccess"));
        console.log(user.userType);
        if (user?.userType === "admin") {
          navigate("/admin/bang-dieu-khien");
        } else if (user?.userType === "doctor") {
          navigate("/admin/lich-lam-viec");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.log(err);
        const errorMessage =
          err.response?.data?.message || "Đăng nhập thất bại.";

        if (
          errorMessage.includes("verify") ||
          errorMessage.includes("kích hoạt")
        ) {
          toast.error(t("toastUnverified"));
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.auth}>
      <div className={styles.auth__illustration}>
        <img src={Illustration} alt="" />
      </div>

      <div className={styles.auth__content}>
        <form className={styles.auth__form} onSubmit={formik.handleSubmit}>
          <div className={styles.auth__social}>
            <h3 className="m-0">{t("socialTitle")}</h3>
            {/* Social icons logic here */}
          </div>

          <div className={styles.auth__divider}>{t("divider")}</div>

          <TextFields
            label={t("emailLabel")}
            type="text"
            id="email"
            name="email"
            formik={formik}
          />

          <TextFields
            label={t("passwordLabel")}
            type={"password"}
            id="password"
            name="password"
            formik={formik}
          />

          <div className={styles.auth__actions}>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" className="m-0 ml-2 cursor-pointer">
              {t("rememberMe")}
            </label>
            <Link to="/quen-mat-khau" className={styles.auth__forgot}>
              {t("forgotPasswordLink")}
            </Link>
          </div>

          <Button
            content={loading ? t("buttonLoading") : t("button")}
            type="submit"
            disabled={loading}
          />

          <div className={styles.auth__register}>
            <span>{t("noAccountText")}</span>
            <Link to="/dang-ky" className={styles.auth__register_link}>
              {t("registerLink")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
