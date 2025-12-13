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

const Login = () => {
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
        .email("Email không hợp lệ")
        .required("Email không được để trống"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 kí tự")
        .required("Mật khẩu không được để trống"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const user = await login(values);

        toast.success("Đăng nhập thành công");
        if (user?.userType === "ADMIN") {
          navigate("/admin/bang-dieu-khien");
        } else if (user?.userType === "DOCTOR") {
          navigate("/admin/lich-lam-viec");
        } else {
          navigate("/");
        }

      } catch (err) {
        console.log(err);

        const errorMessage = err.response?.data?.message || "Đăng nhập thất bại.";

        if (errorMessage.includes("verify") || errorMessage.includes("kích hoạt")) {
          toast.error("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email.");
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
            <h3 className="m-0">Đăng nhập với</h3>
            {/* Social icons logic here */}
          </div>

          <div className={styles.auth__divider}>Hoặc</div>

          <TextFields
            label={"Email"}
            type="text"
            id="email"
            name="email"
            formik={formik}
          />

          <TextFields
            label={"Mật khẩu"}
            type={"password"}
            id="password"
            name="password"
            formik={formik}
          />

          <div className={styles.auth__actions}>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" className="m-0 ml-2 cursor-pointer">Remember me</label>
            <Link to="/quen-mat-khau" className={styles.auth__forgot}>
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            content={loading ? "Đang xử lý..." : "Đăng nhập"}
            type="submit"
            disabled={loading}
          />

          <div className={styles.auth__register}>
            <span>Không có tài khoản?</span>
            <Link to="/dang-ky" className={styles.auth__register_link}>
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;