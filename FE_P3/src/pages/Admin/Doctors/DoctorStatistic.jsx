import React, { useContext } from "react";
import { StatsCardCustom } from "../../../components/sections/stats-card/StatsCard";
import { UserContext } from "../../../providers/UserProvider";
const DoctorStatistic = () => {
  const { totalDoctors, activeDoctors } = useContext(UserContext);

  const onLeave = totalDoctors - activeDoctors;

  const statsData = [
    { label: "Total Doctors", value: totalDoctors, type: "normal" },
    { label: "Available Today", value: activeDoctors, type: "valueBox" },
    { label: "On Leave", value: onLeave, type: "out" },
  ];
  return (
    <div>
      <StatsCardCustom title="Doctor Statistics" stats={statsData} />
    </div>
  );
};

export default DoctorStatistic;
