import React from "react";
import styles from "./style.module.scss";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "../../ui/button";
import Typography from "@mui/material/Typography";

const DoctorCard = ({ doctors, onClick }) => {
  const { fullName, avatarUrl, bio, specialization } = doctors;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 250 }} image={avatarUrl} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {fullName}
        </Typography>
        <div>Khoa: {specialization.name}</div>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {bio}
        </Typography>
      </CardContent>
      <CardActions>
        <Button content={"Đăng ký ngay"} />
        <Button content={"Chi tiết"} onClick={onClick} />
      </CardActions>
    </Card>
  );
};

export default DoctorCard;
