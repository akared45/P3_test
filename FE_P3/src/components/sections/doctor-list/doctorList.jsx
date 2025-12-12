import React, { useEffect, useState } from "react";
import DoctorCard from "../doctor-card/DoctorCard";
import styles from "./style.module.scss";
import { doctorApi } from "../../../services/api";
const DoctorList = ({ onOpenModal }) => {
  const [listDoctor, setListDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllDoctor = async () => {
      try {
        const result = await doctorApi.getAll();
        setListDoctor(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDoctor();
  }, []);

  if (loading) return <div>Đang tải danh sách bác sĩ...</div>;
  return (
    <section className={styles.doctor__list_wrapper}>
      {listDoctor.map((doc) => (
        <DoctorCard
          key={doc.id}
          doctors={doc}
          onClick={() => onOpenModal(doc)}
        />
      ))}
    </section>
  );
};

export default DoctorList;
