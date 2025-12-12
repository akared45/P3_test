import React from "react";
import styles from "./style.module.scss";
const SpecialtyCard = ({ icon, name }) => {
  return (
    <section className={styles.specialty__wrapper}>
      <div className={styles.specialty__icon}>{icon}</div>
      <div className={styles.specialty__name}>{name}</div>
    </section>
  );
};

export default SpecialtyCard;
