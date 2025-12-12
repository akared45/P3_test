import axiosClient from "./axiosClient";

/* ============================
   AUTH API
============================ */
export const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),

  register: (data) => axiosClient.post("/auth/register", data),

  refreshToken: () => axiosClient.post("/auth/refresh"),

  logout: () => axiosClient.post("/auth/logout")
};

/* ============================
   DOCTOR API
============================ */
export const doctorApi = {
  getAll: () => axiosClient.get("/doctors"),

  create: (data) => axiosClient.post("/admin/doctors", data),

  update: (id, data) => axiosClient.put(`/admin/doctors/${id}`, data),

  delete: (id) => axiosClient.delete(`/admin/users/${id}`),

  getById: (id) => axiosClient.get(`/doctors/${id}`)
};

/* ============================
   PATIENT API
============================ */
export const patientApi = {
  getAll: () => axiosClient.get("/patients"),

  delete: (id) => axiosClient.delete(`/admin/users/${id}`),

  getUserById: (id) => axiosClient.get(`/users/${id}`),

  updateMe: (data) => axiosClient.put("/patients/me", data),

  getById: (id) => axiosClient.get(`/users/${id}`),

  updateMe: (data) => axiosClient.put("/patients/me", data)
};

/* ============================
   SPECIALIZATION API
============================ */
export const specApi = {
  getAll: () => axiosClient.get("/specializations"),

  addNew: (data) => axiosClient.post("/specializations", data),

  update: (code, data) => axiosClient.put(`/specializations/${code}`, data),

  delete: (id) => axiosClient.delete(`/specializations/${id}`),
};

/* ============================
   ADMIN API (nếu cần)
============================ */
export const adminApi = {
  getAdmin: () => axiosClient.get("/admin/doctors/U003"),
};

export const appointmentApi = {
  book: (data) => axiosClient.post("/appointments", data),

  getMyAppointments: () => axiosClient.get("/appointments"),

  getBusySlots: (doctorId, date) => {
    return axiosClient.get(`/appointments/busy-slots/${doctorId}`, {
      params: { date }
    });
  }
};

export const aiApi = {
  suggest: (data) => axiosClient.post("/ai/suggest", data),
};

export const chatApi = {
  getHistory: (appointmentId) => axiosClient.get(`/chat/${appointmentId}`),

  send: (data) => axiosClient.post("/chat/send", data),
};
/* ============================
   UPLOAD API
============================ */
export const uploadApi = {
  uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
