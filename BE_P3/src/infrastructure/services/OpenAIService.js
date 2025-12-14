const { GoogleGenerativeAI } = require("@google/generative-ai");
const IAIService = require("../../domain/services/IAIService");
require("dotenv").config();

class GeminiAIService extends IAIService {
  constructor() {
    super();
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("Missing GOOGLE_API_KEY");
    }
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
  }

  async analyzeSymptoms(symptoms, availableSpecialties) {
    try {
      const specListString = availableSpecialties
        .map(s => (typeof s === 'object' ? s.name : s))
        .join(", ");

      const prompt = `
            Đóng vai là một trợ lý y tế ảo chuyên nghiệp.
            
            Nhiệm vụ: Phân tích triệu chứng của bệnh nhân và đề xuất MỘT chuyên khoa phù hợp nhất từ danh sách cho trước.

            Danh sách chuyên khoa hiện có: ${specListString}.

            Triệu chứng bệnh nhân mô tả: "${symptoms}"

            Yêu cầu đầu ra: Chỉ trả về một JSON Object với cấu trúc sau:
            {
                "suggestedSpecialty": "Tên chuyên khoa chính xác lấy từ danh sách trên",
                "reasoning": "Giải thích ngắn gọn, ân cần tại sao chọn khoa này (bằng tiếng Việt)",
                "confidence": "Độ tin cậy của phán đoán (số nguyên từ 0-100)"
            }

            Nếu triệu chứng không rõ ràng hoặc không khớp, hãy chọn khoa gần nhất hoặc "Đa khoa" và để độ tin cậy thấp.
        `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);

    } catch (error) {
      console.error("Gemini AI Error:", error);
      return {
        suggestedSpecialty: "Đa khoa",
        reasoning: "Hệ thống đang bận, vui lòng liên hệ lễ tân.",
        confidence: 0
      };
    }
  }
}

module.exports = GeminiAIService;