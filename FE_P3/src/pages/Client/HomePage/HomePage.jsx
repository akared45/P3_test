import React from "react";
import Introduction from "../../../components/Layouts/ClientLayout/Introduction/Introduction";
import Hero from "../../../components/sections/hero/hero";
import styles from "./style.module.scss";
import { introData } from "../../../data/constant";

const HomePage = () => {
  return (
    <>
      <div className={styles.home__container}>
        <Hero />
        {introData.map((item, index) => (
          <Introduction
            key={index}
            title={item.title}
            description={item.description}
            img={item.img}
            flexDirection={item.flexDirection}
            subimg={item.subimg}
            buttons={item.buttons}
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;
