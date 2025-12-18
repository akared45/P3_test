import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";

const ChatWidget = () => {
  const { t } = useTranslation("chatwidget"); // namespace chatwidget
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!text.trim()) return;

    // Message từ user
    setMessages([...messages, { from: "user", text }]);
    setText("");

    // Phản hồi bot
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: t("botResponse") }]);
    }, 500);
  };

  return (
    <>
      {!open && (
        <button className={styles.floatingBtn} onClick={() => setOpen(true)}>
          <MessageCircle size={26} className={styles.floatingIcon} />
        </button>
      )}

      {open && (
        <div className={styles.chatPopup}>
          <div className={styles.chatBox}>
            <div className={styles.header}>
              <span className={styles.headerTitle}>{t("chatHeaderTitle")}</span>
              <button
                className={styles.headerClose}
                onClick={() => setOpen(false)}
              >
                <X />
              </button>
            </div>

            <div className={styles.messages}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.msg} ${
                    msg.from === "user" ? styles.msgUser : styles.msgDoctor
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <input
                className={styles.input}
                type="text"
                placeholder={t("inputPlaceholder")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className={styles.sendBtn} onClick={sendMessage}>
                {t("sendButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
