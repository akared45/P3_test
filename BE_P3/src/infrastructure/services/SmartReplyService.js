const { GoogleGenerativeAI } = require("@google/generative-ai");

class SmartReplyService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateSuggestions(patientMessage) {
    try {
      const prompt = `
        Bạn là trợ lý AI cho bác sĩ. Bệnh nhân vừa nhắn: "${patientMessage}".
        Hãy gợi ý 3 câu trả lời ngắn gọn (dưới 15 từ), chuyên nghiệp, lịch sự và mang tính y khoa bằng tiếng Việt để bác sĩ chọn nhanh.
        Chỉ trả về danh sách các câu trả lời ngăn cách bởi dấu gạch đứng "|". Ví dụ: Chào bạn|Bạn đau ở đâu?|Tôi sẽ kê đơn ngay.
        Không thêm bất kỳ lời dẫn nào khác.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const suggestions = text.split('|').map(s => s.trim()).filter(s => s.length > 0);
    
      return suggestions.slice(0, 3);
    } catch (error) {
      console.error("AI Error:", error);
      return [];
    }
  }
}

module.exports = new SmartReplyService();