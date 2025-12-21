import axiosClient from "./axiosClient";

/* ============================
   AUTH API
============================ */
export const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),

  register: (data) => axiosClient.post("/auth/register", data),

  refreshToken: () => axiosClient.post("/auth/refresh"),

  logout: () => axiosClient.post("/auth/logout"),

  verifyEmail: (data) => axiosClient.post('/auth/verify-email', data),

  forgotPassword: (data) => axiosClient.post("/auth/forgot-password", data),

  resetPassword: (data) => axiosClient.post("/auth/reset-password", data),
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
  },

  complete: (id, data) => axiosClient.post(`/appointments/${id}/complete`, data)

};

export const aiApi = {
  suggest: (data) => axiosClient.post("/ai/suggest", data),
};

export const chatApi = {
  getHistory: (appointmentId) => axiosClient.get(`/chat/history/${appointmentId}`)
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

export const notificationApi = {
  getAll: (params) => axiosClient.get("/notifications", { params }),

  markAsRead: (id) => axiosClient.patch(`/notifications/${id}/read`),

  delete: (id) => axiosClient.delete(`/notifications/${id}`)
};


export const paymentApi = {
  createVnPayUrl: (data) => axiosClient.post("/payment/vnpay/create_payment_url", data),

  verifyVnPayReturn: (params) => axiosClient.get("/payment/vnpay/vnpay_return", { params })
}

export const statisticsApi = {
  getDashboardStats: (params) => axiosClient.get('/admin/stats', { params }),
};