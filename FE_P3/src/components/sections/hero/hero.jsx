import React from "react";
import Button from "../../ui/button";
import styles from "./style.module.scss";
import Bigimg from "../../../assets/images/blog-bs1.png";
import { useTranslation } from "react-i18next";
const Hero = () => {
  const { t } = useTranslation("homepage");
  return (
    <section className={styles.hero}>
      <div className={styles.hero__left}>
        <h5 className={styles.hero__subtitle}>{t("hero.subtitle")}</h5>

        <h1 className={styles.hero__title}>
          <span>Sức khỏe</span> của bạn, <span>Trách nhiệm</span> của chúng tôi
        </h1>

        <p className={styles.hero__description}>{t("hero.description")}</p>

        <div className={styles.hero__buttons}>
          <Button
            content={t("hero.buttons.register")}
            className={styles.hero__button}
          />
          <Button
            content={t("hero.buttons.learnMore")}
            className={styles.hero__button}
            variant="outlined"
          />
        </div>
      </div>
      <div className={styles.hero__right}>
        <img className={styles.hero__image} src={Bigimg} alt="" />
      </div>
    </section>
  );
};

export default Hero;
