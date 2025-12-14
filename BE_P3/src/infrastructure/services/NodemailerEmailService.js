const nodemailer = require('nodemailer');
require('dotenv').config();

const IEmailService = require('../../domain/services/IEmailService'); 

class NodemailerEmailService extends IEmailService {
    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendVerificationEmail(to, verificationLink) {
        const mailOptions = {
            from: `"Doctor App" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Xác minh tài khoản',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #2c3e50;">Chào mừng bạn đến với Doctor App!</h2>
                    <p>Cảm ơn bạn đã đăng ký. Vui lòng bấm vào nút bên dưới để xác minh tài khoản:</p>
                    <a href="${verificationLink}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Xác minh ngay</a>
                    <p style="margin-top: 20px; color: #7f8c8d; font-size: 12px;">Link này sẽ hết hạn trong 24 giờ.</p>
                </div>
            `
        };
        await this._send(mailOptions);
    }

    async sendPasswordResetEmail(toEmail, resetLink, fullName) {
        const mailOptions = {
            from: `"Doctor App Support" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h3 style="color: #2c3e50;">Xin chào ${fullName || 'Bạn'},</h3>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                    <p>Vui lòng bấm vào liên kết bên dưới để tạo mật khẩu mới:</p>
                    
                    <a href="${resetLink}" style="background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Đặt lại mật khẩu</a>
                    
                    <p><strong>Lưu ý:</strong> Liên kết này chỉ có hiệu lực trong vòng <strong>1 giờ</strong>.</p>
                    <p style="color: #7f8c8d; font-size: 14px;">Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không bị thay đổi.</p>
                </div>
            `
        };
        await this._send(mailOptions);
    }

    async _send(mailOptions) {
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`[Email Service] Email sent successfully to: ${mailOptions.to}`);
        } catch (error) {
            console.error(`[Email Service Error] Failed to send to ${mailOptions.to}:`, error);
        }
    }

    async sendAppointmentConfirmation(toEmail, { patientName, doctorName, time, date }) {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    border: 1px solid #e0e0e0;
                }
                .header {
                    background-color: #1976d2; /* Màu xanh y tế */
                    padding: 30px 20px;
                    text-align: center;
                }
                .header h1 {
                    color: #ffffff;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }
                .body {
                    padding: 30px;
                    color: #333333;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                .info-box {
                    background-color: #f8f9fa;
                    border-left: 5px solid #1976d2;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    font-size: 15px;
                }
                .info-label {
                    color: #666;
                    font-weight: 500;
                }
                .info-value {
                    font-weight: 700;
                    color: #333;
                }
                .cta-button {
                    display: block;
                    width: 200px;
                    margin: 30px auto;
                    padding: 12px 20px;
                    background-color: #1976d2;
                    color: #ffffff !important;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .footer {
                    background-color: #f1f1f1;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body style="background-color: #f4f4f4; padding: 40px 0; margin: 0;">
            <div class="email-container">
                <div class="header">
                    <h1>Xác Nhận Đặt Lịch Thành Công</h1>
                </div>

                <div class="body">
                    <p class="greeting">Xin chào <strong>${patientName}</strong>,</p>
                    <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ. Lịch hẹn khám bệnh trực tuyến của bạn đã được hệ thống xác nhận.</p>
                    
                    <div class="info-box">
                        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                            <strong>Thông tin chi tiết:</strong>
                        </div>
                        <table width="100%" style="border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Bác sĩ phụ trách:</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">BS. ${doctorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Thời gian:</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">${time}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Ngày khám:</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #d32f2f;">${date}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Hình thức:</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">Tư vấn trực tuyến</td>
                            </tr>
                        </table>
                    </div>

                    <p>Vui lòng đăng nhập vào hệ thống trước giờ hẹn <strong>5 phút</strong> để chuẩn bị kết nối tốt nhất.</p>

                    <a href="${this.frontendUrl}/appointments" class="cta-button">Xem Lịch Hẹn Của Tôi</a>
                </div>

                <div class="footer">
                    <p>Đây là email tự động, vui lòng không trả lời email này.</p>
                    <p>© 2025 BookingCare System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await this.transporter.sendMail({
            from: `"BookingCare System" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `✅ Xác nhận lịch khám với BS ${doctorName} - ${date}`,
            html: htmlContent
        });
    }
}

module.exports = NodemailerEmailService;