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
}

module.exports = NodemailerEmailService;