import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import Button from "../../../components/ui/Button";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const { t } = useTranslation("auth_register");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useContext(AuthContext);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(t("verifyEmail.verifyingMessage"));

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(t("verifyEmail.errorNoToken"));
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage(t("verifyEmail.successMessage"));
      } catch (error) {
        setStatus("error");
        setMessage(t("verifyEmail.errorInvalid"));
      }
    };

    verify();
  }, [searchParams, verifyEmail, t]);

  return (
    <div className={styles.auth}>
      <div
        className={styles.auth__content}
        style={{ margin: "auto", textAlign: "center", padding: "40px" }}
      >
        <h2 className="mb-4">{t("verifyEmail.title")}</h2>

        {status === "verifying" && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        <p
          className={`mb-4 ${
            status === "error" ? "text-danger" : "text-success"
          }`}
          style={{ fontSize: "1.1rem" }}
        >
          {message}
        </p>

        {status === "success" && (
          <Button
            content={t("verifyEmail.buttonGoToLogin")}
            onClick={() => navigate("/dang-nhap")}
          />
        )}

        {status === "error" && (
          <Button
            content={t("verifyEmail.buttonBackToRegister")}
            onClick={() => navigate("/dang-ky")}
          />
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
