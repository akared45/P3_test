import React, { useState, useContext } from "react";
import Button from "../../../components/ui/Button";
import TextFields from "../../../components/ui/TextFields";
import Illustration from "@images/draw.png";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContext } from "../../../providers/ToastProvider";
import { AuthContext } from "../../../providers/AuthProvider";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation("auth_register");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useContext(ToastContext);
  const { register } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required(t("validationFullNameRequired")),
      username: Yup.string().required(t("validationUsernameRequired")),
      email: Yup.string()
        .email(t("validationEmailInvalid"))
        .required(t("validationEmailRequired")),
      password: Yup.string()
        .min(6, t("validationPasswordMin"))
        .required(t("validationPasswordRequired")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], t("validationConfirmMismatch"))
        .required(t("validationConfirmRequired")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await register(values);
        toast.success(t("toastSuccess"), {
          autoClose: 5000,
        });
        navigate("/dang-nhap");
      } catch (err) {
        console.log(err);
        const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
        toast.error(errorMessage);
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
            <div className={styles.auth__social_list}>
              <div className={styles.auth__social_item}>
                <FaFacebookF />
              </div>
              <div className={styles.auth__social_item}>
                <FaTwitter />
              </div>
              <div className={styles.auth__social_item}>
                <FaLinkedinIn />
              </div>
            </div>
          </div>

          <div className={styles.auth__divider}>{t("divider")}</div>

          {/* Họ và tên */}
          <TextFields
            label={t("fullNameLabel")}
            name="fullName"
            type="text"
            formik={formik}
          />

          {/* Tên đăng nhập */}
          <TextFields
            label={t("usernameLabel")}
            name="username"
            type="text"
            formik={formik}
          />

          {/* Email */}
          <TextFields
            label={t("emailLabel")}
            name="email"
            type="text"
            formik={formik}
          />

          {/* Mật khẩu */}
          <TextFields
            label={t("passwordLabel")}
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          {/* Nhập lại mật khẩu */}
          <TextFields
            label={t("confirmPasswordLabel")}
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />

          <div className={styles.auth__actions_regis}>
            <input type="checkbox" required />
            <p className="m-0">{t("termsCheckbox")}</p>
          </div>

          <Button content={t("button")} disabled={loading} type="submit" />

          <div className={styles.auth__register}>
            <span>{t("haveAccountText")}</span>
            <Link to="/dang-nhap" className={styles.auth__register_link}>
              {t("loginLink")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
