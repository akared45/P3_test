import React from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import Button from "../../../ui/Button";
const Introduction = ({
  title,
  description,
  img,
  flexDirection = false,
  subimg,
  buttons = [],
}) => {
  return (
    <section
      className={classNames({
        [styles.introduction__reverse]: flexDirection,
        [styles.introduction]: !flexDirection,
      })}
    >
      <div className={styles.col__left}>
        <img className={styles.intro__subimg} src={subimg} alt="" />
        <h2 className={styles.intro__title}>{title}</h2>
        <p className={styles.intro__des}>{description}</p>
        <div className={styles.intro__btns}>
          {buttons.slice(0, 2).map((btn, index) => (
            <Button key={index} content={btn.content} variant={btn.variant} />
          ))}
        </div>
        <div className={styles.intro__subBtn}>
          {buttons.slice(2).map((btn, index) => (
            <Button key={index} content={btn.content} variant={btn.variant} />
          ))}
        </div>
      </div>
      <div className={styles.col__right}>
        <img className={styles.intro__img} src={img} alt="" />
      </div>
    </section>
  );
};

export default Introduction;
