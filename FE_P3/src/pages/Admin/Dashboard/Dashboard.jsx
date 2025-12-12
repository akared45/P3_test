import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import styles from "./style.module.scss";
import { StatsCardSmall } from "../../../components/sections/stats-card/statsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const data = [
  { month: "Jan", total: 50 },
  { month: "Feb", total: 80 },
  { month: "Mar", total: 65 },
  { month: "Apr", total: 90 },
  { month: "May", total: 120 },
];
const dataCard = [
  {
    title: "Total doctor",
    icon: <PersonIcon />,
    value: "150",
  },
  {
    title: "Total doctor",
    icon: <PersonIcon />,
    value: "150",
  },
  {
    title: "Total doctor",
    icon: <PersonIcon />,
    value: "150",
  },
];

const Dashboard = () => {
  return (
    <div className={styles.dashboard__container}>
      <div className={styles.dashboard__col_left}>
        <div className={styles.dashboard__card}>
          {dataCard.map((i) => (
            <StatsCardSmall title={i.title} icon={i.icon} value={i.value} />
          ))}
        </div>
        <div className={styles.dashboard__chart}>
          <div
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "12px",
              boxSizing: "border-box",
              backgroundColor: "#fff",
              boxShadow: "0 0 8px rgba(0,0,0,0.4)",
            }}
          >
            <h4>Patient activity</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.dashboard__report}>
            <h5>Reports</h5>
            <div className={styles.report__box}>
              <TipsAndUpdatesOutlinedIcon />
              <p className={styles.report__content}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tempore, est.
              </p>
            </div>
            <div className={styles.report__box}>
              <TipsAndUpdatesOutlinedIcon />
              <p className={styles.report__content}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tempore, est.
              </p>
            </div>
            <div className={styles.report__box}>
              <TipsAndUpdatesOutlinedIcon />
              <p className={styles.report__content}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tempore, est.
              </p>
            </div>
          </div>
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className={styles.dashboard__col_right}>
        <div className={styles.calendar__wrapper}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar sx={{ margin: 0, padding: 0 }} />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
