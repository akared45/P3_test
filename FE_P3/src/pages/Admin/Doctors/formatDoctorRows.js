export const formatDoctorRows = (doctors) =>
  doctors.map((item) => ({
    id: item.id,
    avatar: item.avatarUrl || "",
    fullName: item.fullName || "Chưa cập nhật",
    email: item.email,
    specialization: item.specialization?.name || "Chưa cập nhật",
    licenseNumber: item.licenseNumber,
    yearsExperience: item.yearsExperience,
    rating: item.rating,
    isActive: item.isActive,
  }));
