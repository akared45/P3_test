import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./style.module.scss";
import { aiApi } from "../../../services/api";
import { useTranslation } from "react-i18next";
const doctorAvatarUrl =
  "https://img.freepik.com/free-vector/hand-drawn-ai-healthcare-illustration_52683-156475.jpg?semt=ais_hybrid&w=740&q=80";

const ChatWidget = () => {
  const { t } = useTranslation("chatwidget");
  console.log(doctorAvatarUrl);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "doctor",
      text: t("chatWidget.initialMessage"),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = { from: "user", text };
    setMessages([...messages, userMessage]);
    setText("");
    setLoading(true);

    try {
       const response = await aiApi.suggest({ symptoms: text });
        console.log*(response);
        const suggestion = response.data?.suggestion;
        
        const aiMessage = {
            from: "doctor",
            text: suggestion 
                ? `[Chuyên khoa gợi ý: ${suggestion.specialtyName}]\n\n${suggestion.reasoning}`
                : t("chatWidget.fallbackMessage"),
        };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "doctor", text: t("chatWidget.errorMessage") },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {!open && (
        <div
          className={`${styles.floatingImageContainer} ${styles.wobbleAnimation}`}
          onClick={() => setOpen(true)}
        >
          <div className={styles.chatBubbleHint}>
            {t("chatWidget.floatingHint")}
          </div>
          <img
            src={doctorAvatarUrl}
            alt={t("chatWidget.doctorAlt")}
            className={styles.doctorImage}
          />
        </div>
      )}

      {open && (
        <div className={styles.overlay}>
          <div className={styles.chatBox}>
            <div className={styles.header}>
              <span className={styles.headerTitle}>
                {t("chatWidget.headerTitle")}
              </span>
              <button
                className={styles.headerClose}
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.msg} ${
                    msg.from === "user" ? styles.msgUser : styles.msgDoctor
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className={`${styles.msg} ${styles.msgDoctor}`}>
                  {t("chatWidget.loadingMessage")}
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <input
                className={styles.input}
                type="text"
                placeholder={t("chatWidget.inputPlaceholder")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className={styles.sendBtn} onClick={sendMessage}>
                {t("chatWidget.sendButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
