import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./style.module.scss";
import { aiApi } from "../../../services/api";
const doctorAvatarUrl = "https://img.freepik.com/free-vector/hand-drawn-ai-healthcare-illustration_52683-156475.jpg?semt=ais_hybrid&w=740&q=80";

const ChatWidget = () => {
    console.log(doctorAvatarUrl);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { from: "doctor", text: "Xin chào! Tôi là trợ lý y tế ảo. Bạn đang gặp vấn đề gì về sức khỏe? Hãy mô tả để tôi tư vấn chuyên khoa phù hợp nhé." }
  ])
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
        <div
          className={`${styles.floatingImageContainer} ${styles.wobbleAnimation}`}
          onClick={() => setOpen(true)}
        >
          <div className={styles.chatBubbleHint}>
            Tư vấn ngay!
          </div>
          <img
            src={doctorAvatarUrl}
            alt="Chat với bác sĩ AI"
            className={styles.doctorImage}
          />
        </div>
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

            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.msg} ${msg.from === "user" ? styles.msgUser : styles.msgDoctor
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
