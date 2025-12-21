import React from "react";
import Introduction from "../../../components/Layouts/ClientLayout/Introduction/Introduction";
import Hero from "../../../components/sections/hero/hero";
import Bs1 from "@images/blog-bs1.png";
import Bs2 from "@images/bs2.png";
import Bs3 from "@images/khamtainha.png";
import Bs4 from "@images/bs4.png";
import Bs5 from "@images/bs5.png";
import Subimg from "@images/partern.png";
import Subimg2 from "@images/Vector123.png";

import ChatWidget from "../ChatWidget/ChatWidget";
import { Container } from "@mui/material";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation("homepage");

  const introData = [
    { img: Bs5, flexDirection: true, buttons: [{ variant: "contained" }] },
    { img: Bs2, flexDirection: false, subimg: Subimg, buttons: [{}] },
    { img: Bs3, flexDirection: true, buttons: [] },
    { img: Bs4, flexDirection: false, subimg: Subimg2, buttons: [] },
  ];

  return (
    <Container
      maxWidth="xl"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ChatWidget />
      <Hero />
      {introData.map((item, index) => (
        <Introduction
          key={index}
          title={t(`intro.${index}.title`)}
          description={t(`intro.${index}.description`)}
          img={item.img}
          flexDirection={item.flexDirection}
          subimg={item.subimg}
          buttons={item.buttons.map((btn, i) => ({
            ...btn,
            content: t(`intro.${index}.buttons.${i}.content`),
          }))}
        />
      ))}
    </Container>
  );
};

export default HomePage;
