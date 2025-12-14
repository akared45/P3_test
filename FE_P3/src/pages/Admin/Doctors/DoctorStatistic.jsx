import React, { useContext } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { UserContext } from "../../../providers/UserProvider";

const DoctorStatistic = () => {
  const { totalDoctors, activeDoctors } = useContext(UserContext);
  const onLeave = totalDoctors - activeDoctors;

  const statsData = [
    { 
      label: "Tổng", 
      value: totalDoctors, 
      color: "#1976d2",
      bgColor: "rgba(25, 118, 210, 0.08)"
    },
    { 
      label: "Đang làm việc", 
      value: activeDoctors, 
      color: "#2e7d32",
      bgColor: "rgba(46, 125, 50, 0.08)"
    },
    { 
      label: "Nghỉ phép", 
      value: onLeave, 
      color: "#ed6c02",
      bgColor: "rgba(237, 108, 2, 0.08)"
    },
  ];

  return (
    <Grid container spacing={2}>
      {statsData.map((stat, index) => (
        <Grid item xs={4} key={index}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              border: `1px solid ${stat.color}20`,
              backgroundColor: stat.bgColor,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${stat.color}20`,
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0,0,0,0.7)",
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 1,
                textAlign: "center"
              }}
            >
              {stat.label}
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: stat.color,
                fontWeight: 700,
                fontSize: "1.75rem",
                lineHeight: 1
              }}
            >
              {stat.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DoctorStatistic;