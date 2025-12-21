import React from "react";
import styles from "./style.module.scss";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import Button from "../../../components/ui/button";
const SuccessPayment = () => {
  return (
    <div className={styles.success__container}>
      <div className={styles.success__wrapper}>
        <CheckCircleOutlineOutlinedIcon
          style={{ width: "60px", height: "60px", color: "green" }}
        />
        <h2>THANH TOÁN THÀNH CÔNG</h2>
        <div className={styles.success__details}>
          <span className={styles.success__key}>Mã đơn: </span>#33334
          <span className={styles.success__key}>Tổng tiền: </span>1.0000 VNĐ
        </div>
        <div className={styles.success__key}>Kiểu thanh toán: Online</div>
        <div style={{ width: "270px" }}>
          <Button content={"Quay về trang chủ"} />
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
