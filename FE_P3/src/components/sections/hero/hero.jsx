import React from "react";
import Button from "../../ui/button";
import styles from "./style.module.scss";
import Bigimg from "../../../assets/images/blog-bs1.png";
const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__left}>
        <h5 className={styles.hero__subtitle}>
          Welcome to your health care destination
        </h5>

        <h1 className={styles.hero__title}>
          Your <span>Health</span>, Our Priority Expert <span>Care</span> You
          Can Trust
        </h1>

        <p className={styles.hero__description}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
          nemo accusamus veniam quisquam excepturi similique porro illum qui,
          dolore repudiandae, laborum pariatur cum.
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
