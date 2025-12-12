import React, { createContext, useState, useEffect } from "react";
import { doctorApi, patientApi } from "@services/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter((d) => d.isActive).length;
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.isActive).length;

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const res = await doctorApi.getAll();
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const res = await patientApi.getAll();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const addDoctor = async (data) => {
    try {
      const res = await doctorApi.create(data);
      setDoctors((prev) => [...prev, res.data]);
    } catch (err) {
      throw err;
    }
  };

  const updateDoctor = async (id, data) => {
    try {
      const res = await doctorApi.update(id, data);
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...res.data } : d))
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await doctorApi.delete(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const deletePatient = async (id) => {
    try {
      await patientApi.delete(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // ------------------ EFFECT ------------------
  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <UserContext.Provider
      value={{
        doctors,
        loadingDoctors,
        totalDoctors,
        activeDoctors,
        refreshDoctors: fetchDoctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        patients,
        loadingPatients,
        totalPatients,
        activePatients,
        refreshPatients: fetchPatients,
        deletePatient,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
