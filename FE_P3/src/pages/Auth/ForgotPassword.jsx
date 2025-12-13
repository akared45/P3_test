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

const ForgotPassword = () => {
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await authApi.forgotPassword(values);
        toast.success("Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi!");
        
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
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
            <h2 className="text-2xl font-bold text-primary mb-2">Quên mật khẩu?</h2>
            <p className="text-gray-500 text-sm">
              Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
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
            content={loading ? "Đang gửi..." : "Gửi yêu cầu"}
            type="submit"
            disabled={loading}
          />

          <div className={styles.auth__register}>
            <Link to="/dang-nhap" className={styles.auth__register_link}>
              &larr; Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;