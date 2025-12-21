// src/domain/services/MedicalSafetyService.js

class MedicalSafetyService {
  checkSafety(medication, patientProfile) {
    const warnings = [];

    // CHUẨN HÓA DỮ LIỆU: Đảm bảo luôn là mảng, kể cả khi DB bị thiếu trường
    const allergens = medication?.allergens || [];
    const contraindications = medication?.contraindications || [];
    const patientAllergies = patientProfile?.allergies || [];

    // 1. Kiểm tra dị ứng thuốc
    const isAllergic = allergens.some(allergen =>
      patientAllergies.includes(allergen)
    );
    
    if (isAllergic) {
      warnings.push(`Cảnh báo: Bệnh nhân có tiền sử dị ứng với thành phần trong ${medication.genericName || 'thuốc này'}`);
    }

    // 2. Kiểm tra chống chỉ định cho phụ nữ mang thai
    if (patientProfile?.isPregnant && contraindications.includes('pregnant')) {
      warnings.push(`Cảnh báo: Thuốc ${medication.name} chống chỉ định cho phụ nữ mang thai`);
    }

    // 3. Kiểm tra độ tuổi (Trẻ em dưới 12 tuổi)
    const age = patientProfile?.age || 0;
    if (age < 12 && contraindications.includes('children_under_12')) {
      warnings.push(`Cảnh báo: Thuốc ${medication.name} không dùng cho trẻ em dưới 12 tuổi`);
    }

    return {
      isSafe: warnings.length === 0,
      warnings: warnings
    };
  }
}

module.exports = MedicalSafetyService;