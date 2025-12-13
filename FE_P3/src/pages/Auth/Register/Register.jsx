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

const Register = () => {
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
      fullName: Yup.string().required("Họ và tên không được để trống"),
      username: Yup.string().required("Tên đăng nhập không được để trống"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email không được để trống"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu không được để trống"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Bạn cần nhập lại mật khẩu"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await register(values);
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.", {
            autoClose: 5000
        })
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
            <h3 className="m-0">Đăng ký với</h3>
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

          <div className={styles.auth__divider}>hoặc</div>

          {/* Họ và tên */}
          <TextFields
            label="Họ và tên"
            name="fullName"
            type="text"
            formik={formik}
          />

          {/* Tên đăng nhập */}
          <TextFields
            label="Tên đăng nhập"
            name="username"
            type="text"
            formik={formik}
          />

          {/* Email */}
          <TextFields label="Email" name="email" type="text" formik={formik} />

          {/* Mật khẩu */}
          <TextFields
            label="Mật khẩu"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          {/* Nhập lại mật khẩu */}
          <TextFields
            label="Nhập lại mật khẩu"
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
            <p className="m-0">Tôi đã đọc và đồng ý các điều khoản</p>
          </div>

          <Button content={"Đăng ký"} disabled={loading} type="submit" />

          <div className={styles.auth__register}>
            <span>Đã có tài khoản?</span>
            <Link to="/dang-nhap" className={styles.auth__register_link}>
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
