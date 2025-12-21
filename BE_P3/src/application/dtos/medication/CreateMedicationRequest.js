// src/application/dtos/medication/CreateMedicationRequest.js
class CreateMedicationRequest {
    constructor({ code, name, genericName, drugClass, safety, usage }) {
        if (!code) throw new Error("Mã thuốc là bắt buộc");
        if (!name) throw new Error("Tên thuốc là bắt buộc");
        if (!genericName) throw new Error("Tên hoạt chất (Generic) là bắt buộc");

        this.code = code.toUpperCase().trim();
        this.name = name.trim();
        this.genericName = genericName.trim();
        this.drugClass = drugClass || "Chưa phân loại";
        
        // Chuẩn hóa dữ liệu an toàn
        this.safety = {
            contraindications: safety?.contraindications || [],
            allergens: safety?.allergens || [],
            isPregnancySafe: !!safety?.isPregnancySafe
        };

        // Chuẩn hóa cách dùng
        this.usage = {
            timing: usage?.timing || 'ANYTIME',
            instructions: usage?.instructions || ""
        };
        
        Object.freeze(this);
    }
}

module.exports = CreateMedicationRequest;