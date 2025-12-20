import React from "react";
import Button from "../../ui/button";
import styles from "./style.module.scss";
import Bigimg from "../../../assets/images/blog-bs1.png";
const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__left}>
        <h5 className={styles.hero__subtitle}>
          Chào mừng bạn đến với Medicare
        </h5>

        <h1 className={styles.hero__title}>
          <span>Sức khỏe</span> của bạn, <span>Trách nhiệm</span> của chúng tôi
        </h1>

        <p className={styles.hero__description}>
          Tại Medicare, chúng tôi kết hợp đội ngũ bác sĩ hàng đầu cùng công nghệ
          y khoa tiên tiến nhất để mang lại lộ trình điều trị tối ưu. Sức khỏe
          của bạn là sứ mệnh cao cả nhất của chúng tôi
        </p>

        <div className={styles.hero__buttons}>
          <Button content={"Đăng ký ngay"} className={styles.hero__button} />
          <Button
            content={"Xem thêm"}
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
