import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import styles from "./style.module.scss";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages([...messages, { from: "user", text }]);
    setText("");

    // mô phỏng bác sĩ trả lời
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Bác sĩ đã nhận được tin nhắn của bạn!" },
      ]);
    }, 500);
  };

  return (
    <>
      {/* NÚT MỞ CHAT */}
      {!open && (
        <button className={styles.floatingBtn} onClick={() => setOpen(true)}>
          <MessageCircle size={26} className={styles.floatingIcon} />
        </button>
      )}

      {/* POPUP CHAT */}
      {open && (
        <div className={styles.chatPopup}>
          <div className={styles.chatBox}>
            
            {/* HEADER */}
            <div className={styles.header}>
              <span className={styles.headerTitle}>Chat với bác sĩ</span>
              <button className={styles.headerClose} onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {/* BODY */}
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

            {/* FOOTER */}
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
