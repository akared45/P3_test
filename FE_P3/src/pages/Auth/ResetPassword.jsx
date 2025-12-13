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

const ResetPassword = () => {
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
        .min(6, "Mật khẩu phải có ít nhất 6 kí tự")
        .required("Mật khẩu mới không được để trống"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu"),
    }),
    onSubmit: async (values) => {
      if (!token || !email) {
        toast.error("Liên kết không hợp lệ hoặc thiếu thông tin xác thực.");
        return;
      }

      setLoading(true);
      try {
        await authApi.resetPassword({
          token: token,
          email: email,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword
        });

        toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
        navigate("/dang-nhap");

      } catch (err) {
        console.error(err);
        const errorMsg = err.response?.data?.message || "Đặt lại mật khẩu thất bại.";
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
            <h2 className="text-2xl font-bold text-primary mb-2">Đặt lại mật khẩu</h2>
            <p className="text-gray-500 text-sm">
              Vui lòng nhập mật khẩu mới của bạn bên dưới.
            </p>
          </div>

          <TextFields
            label={"Mật khẩu mới"}
            type="password"
            id="newPassword"
            name="newPassword"
            formik={formik}
          />

          <TextFields
            label={"Xác nhận mật khẩu"}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            formik={formik}
          />

          <Button
            content={loading ? "Đang xử lý..." : "Xác nhận thay đổi"}
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;