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
Bạn đang đóng vai lễ tân y tế / điều phối khám bệnh tại một cơ sở y tế.

Công việc của bạn là lắng nghe triệu chứng bệnh nhân mô tả và gợi ý MỘT chuyên khoa phù hợp nhất để bệnh nhân đăng ký khám ban đầu.
Bạn không chẩn đoán bệnh, mà chỉ giúp bệnh nhân đi đúng khoa, giống như cách lễ tân hoặc điều dưỡng tại bệnh viện vẫn làm hằng ngày.

Các chuyên khoa hiện có (chỉ được chọn trong danh sách này):
${specListString}

Triệu chứng bệnh nhân chia sẻ:
"${symptoms}"

Cách bạn nên suy nghĩ và trả lời:
- Chọn chuyên khoa thường tiếp nhận các triệu chứng này nhất trong thực tế
- Nếu triệu chứng chưa rõ ràng hoặc có thể liên quan nhiều khoa, hãy:
  - Ưu tiên khoa tiếp cận ban đầu phù hợp, hoặc
  - Chọn "Đa khoa" để bác sĩ tổng quát thăm khám trước
- Cách diễn đạt cần tự nhiên, gần gũi, dễ hiểu, như đang giải thích trực tiếp cho bệnh nhân
- Giữ thái độ ân cần, trấn an, giúp bệnh nhân cảm thấy yên tâm khi đăng ký khám

Yêu cầu bắt buộc về đầu ra:
- Chỉ trả về MỘT JSON object duy nhất
- Không sử dụng markdown
- Không kèm theo bất kỳ nội dung nào ngoài JSON

Định dạng JSON:
{
  "suggestedSpecialty": "Tên chuyên khoa chính xác lấy từ danh sách trên",
  "reasoning": "Giải thích rõ ràng, dễ hiểu vì sao chuyên khoa này phù hợp, theo cách nói của lễ tân bệnh viện",
  "confidence": "Mức độ phù hợp của đề xuất (số nguyên từ 0 đến 100)"
}

Lưu ý quan trọng:
- Không khẳng định hay chẩn đoán bệnh cụ thể
- Không dùng từ ngữ gây lo lắng không cần thiết
- Không nhắc đến AI, hệ thống hay mô hình
- Không đề xuất chuyên khoa ngoài danh sách
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

  async generateSmartReplies(patientMessage) {
    try {
      if (!patientMessage || patientMessage.trim().length === 0) return [];

      const prompt = `
        Bạn là trợ lý AI hỗ trợ bác sĩ tư vấn trực tuyến. 
        Bệnh nhân vừa nhắn: "${patientMessage}"
        Hãy gợi ý 3 câu trả lời ngắn gọn (dưới 15 từ), chuyên nghiệp, lịch sự, mang tính y khoa và đồng cảm để bác sĩ chọn nhanh.
        Yêu cầu Output JSON:
        {
          "suggestions": ["Câu gợi ý 1", "Câu gợi ý 2", "Câu gợi ý 3"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const jsonResponse = JSON.parse(response.text());
      
      return jsonResponse.suggestions || [];

    } catch (error) {
      console.error("Gemini SmartReply Error:", error);
      return []; 
    }
  }
}

module.exports = GeminiAIService;