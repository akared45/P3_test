const crypto = require("crypto");

const secretKey = "UZXGCOYREOYIOGYCVYVBNYVBSYVBYVBY";
const signData = "vnp_Amount=5000000&vnp_Command=pay&vnp_CreateDate=20251221101642&vnp_CurrCode=VND&vnp_IpAddr=13.160.92.202&vnp_Locale=vn&vnp_OrderInfo=Thanh_toan_lich_hen_a2730d826287002569&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:5173/payment-result&vnp_TmnCode=2QXG2YQ8&vnp_TxnRef=a2730d826287002569&vnp_Version=2.1.0";

const hmac = crypto.createHmac("sha512", secretKey);
hmac.update(signData, 'utf-8');
const hash = hmac.digest('hex');

console.log("=== VNPAY DEBUG ===");
console.log("Secret Key:", secretKey);
console.log("Secret Key Length:", secretKey.length);
console.log("Sign Data Length:", signData.length);
console.log("\nGenerated Hash:");
console.log(hash);
console.log("\nYour Hash (from log):");
console.log("8de577e6fc2d24cac7c786469139a1a7b41a5049960127f546701eb3c4645a4a3b06ad7605b0796052e31993b4ad34d11cc2c1ba991b68c0da02f1aba932ed9b");
console.log("\nMatch?", hash === "8de577e6fc2d24cac7c786469139a1a7b41a5049960127f546701eb3c4645a4a3b06ad7605b0796052e31993b4ad34d11cc2c1ba991b68c0da02f1aba932ed9b");