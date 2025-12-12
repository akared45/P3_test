import { useState } from "react";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./style.module.scss";
import { aiApi } from "../../../services/api";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = { from: "user", text };
    setMessages([...messages, userMessage]);
    setText("");
    setLoading(true);

    try {
      const response = await aiApi.suggest({ prompt: text });
      const aiMessage = {
        from: "doctor",
        text: response.data?.reply || "Xin lỗi, bác sĩ chưa trả lời kịp.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "doctor", text: "Có lỗi xảy ra, vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {!open && (
        <button className={styles.floatingBtn} onClick={() => setOpen(true)}>
          <ChatBubbleOutlineIcon />
        </button>
      )}

      {open && (
        <div className={styles.overlay}>
          <div className={styles.chatBox}>
            <div className={styles.header}>
              <span className={styles.headerTitle}>Chat với bác sĩ</span>
              <button
                className={styles.headerClose}
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Message list */}
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
                  Đang trả lời...
                </div>
              )}
            </div>

            {/* Input */}
            <div className={styles.footer}>
              <input
                className={styles.input}
                type="text"
                placeholder="Nhập tin nhắn..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className={styles.sendBtn} onClick={sendMessage}>
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
