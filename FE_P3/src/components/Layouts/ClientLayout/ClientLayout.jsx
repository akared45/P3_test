import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/header";
import Footer from "./footer/footer";
import DoctorChat from "./DoctorChat/DoctorChat";
import PatientChat from "./PatientChat/PatientChat";
import { AuthContext } from "../../../providers/AuthProvider";
import styles from "./style.module.scss";

const ClientLayout = () => {
  const { user } = useContext(AuthContext);
  const userRole = user?.userType || user?.role;

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        <div className={styles.main__container}>
          <Outlet />
        </div>
      </div>

      <Footer />

      <div style={{ position: 'fixed', zIndex: 9999 }}>
        {userRole === "doctor" && <DoctorChat />}
        {userRole === "patient" && <PatientChat />}
      </div>
    </>
  );
};

export default ClientLayout;