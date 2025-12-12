import React, { useContext } from "react";
import { StatsCardCustom } from "../../../components/sections/stats-card/StatsCard";

const SpecialtyStatistic = ({value}) => {
      


  const statsData = [
    { label: "Total specialty", value: value, type: "normal" },
  ];
  return (
    <div>
      <StatsCardCustom title="Doctor Statistics" stats={statsData} />
    </div>
  );
};

export default SpecialtyStatistic;
