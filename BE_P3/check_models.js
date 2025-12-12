// check_models.js
require('dotenv').config();

async function checkModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("❌ Chưa có GOOGLE_API_KEY trong file .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log("⏳ Đang kết nối đến Google...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Lỗi API:", data.error.message);
      return;
    }

    console.log("\n✅ DANH SÁCH MODEL BẠN ĐƯỢC DÙNG:");
    console.log("====================================");
    
    // Lọc ra các model tạo nội dung (generateContent)
    const models = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));

    models.forEach(name => console.log(`👉 ${name}`));
    console.log("====================================");
    console.log("💡 Hãy copy một trong các tên trên vào code của bạn.");

  } catch (error) {
    console.error("❌ Lỗi mạng:", error.message);
  }
}

checkModels();