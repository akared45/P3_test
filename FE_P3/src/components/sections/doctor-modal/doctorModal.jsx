import React from "react";
import styles from "./style.module.scss";
import CloseIcon from "@mui/icons-material/Close";

const DoctorModal = ({ data, onClose }) => {
  if (!data) return null;

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN");
  };

  const { fullName, bio, qualifications, specialization, workHistory } = data;

  return (
    <div className={styles.overlay}>
      <section className={styles.modalWrapper}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderInfo}>
            <h4 className={styles.modalName}>{fullName}</h4>
            <p className={styles.modalSpec}>
              Chuyên khoa {specialization.name}
            </p>
          </div>
          <div className={styles.modalClose} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>

        <div className={styles.modalBody}>
          {bio && <p className={styles.modalBio}>{bio}</p>}
          <div className={styles.modalSection}>
            <h5 className={styles.modalSectionTitle}>Quá trình đào tạo</h5>
            <ul className={styles.modalList}>
              {qualifications.map((i, index) => (
                <li key={index}>
                  <span>
                    Tốt nghiệp {i.degree} tại {i.institution}
                  </span>
                </li>
              )) || <li>Chưa cập nhật</li>}
            </ul>
          </div>

          <div className={styles.modalSection}>
            <h5 className={styles.modalSectionTitle}>Quá trình công tác</h5>
            <ul className={styles.modalList}>
              {workHistory?.map((i, index) => (
                <li key={index}>
                  {i.position} tại {i.place} từ {formatDate(i.from)} đến{" "}
                  {i.to ? formatDate(i.to) : "nay"}
                </li>
              )) || <li>Chưa cập nhật</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorModal;
