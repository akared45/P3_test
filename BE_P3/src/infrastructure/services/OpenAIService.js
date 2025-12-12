const { GoogleGenerativeAI } = require("@google/generative-ai");
const IAIService = require("../../application/interfaces/IAIService");
require("dotenv").config();

class GeminiAIService extends IAIService {
  constructor() {
    super();
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async suggestSpecialty(symptoms, availableSpecialties) {
    const specsList = availableSpecialties.map((s) => `${s._id}: ${s.name}`).join(", ");

    const prompt = `
      Bạn là một Trợ lý Y tế ảo thân thiện, tận tâm tại phòng khám Telemedicine.
      
      Nhiệm vụ 1: Phân tích triệu chứng: "${symptoms}".
      Nhiệm vụ 2: Chọn 1 chuyên khoa phù hợp nhất từ danh sách: [${specsList}].
      
      Yêu cầu Output: Trả về JSON object (không markdown) với format:
      {
        "code": "Mã chuyên khoa (VD: CARD)",
        "reason": "Giải thích ngắn gọn về mặt y học (để lưu hồ sơ)",
        "isEmergency": true/false,
        "message": "Câu trả lời dành cho bệnh nhân."
      }

      Quy tắc cho trường 'message':
      1. Giọng điệu: Thân thiện, quan tâm, như bác sĩ nói chuyện với bệnh nhân.
      2. Nội dung: Khuyên bệnh nhân nên khám chuyên khoa nào (dùng Tên tiếng Việt, đừng dùng Mã code).
      3. Ví dụ: "Chào bạn, với triệu chứng đau ngực trái, bạn nên sớm đi khám chuyên khoa Tim mạch để được bác sĩ kiểm tra kỹ hơn nhé."
      4. Nếu triệu chứng không rõ, hãy hỏi thêm chi tiết.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return { code: "INTERNAL", reason: "Lỗi kết nối AI", isEmergency: false };
    }
  }
}

module.exports = GeminiAIService;