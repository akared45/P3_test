const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
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
    async _send(mailOptions) {
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to: ${mailOptions.to}`);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }

    async sendVerificationEmail(to, verificationLink) {
        try {
            const templatePath = path.join(__dirname, 'templates', 'verification_email.html');
            let html = fs.readFileSync(templatePath, 'utf8');
            html = html.replace('{{verificationLink}}', verificationLink);
            const mailOptions = {
                from: `"Doctor App" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: 'Xác minh tài khoản Doctor App',
                html: html
            };
            await this._send(mailOptions);
        } catch (error) {
            console.error("Lỗi đọc template verification:", error);
        }
    }

    async sendPasswordResetEmail(toEmail, resetLink, fullName) {
        try {
            const templatePath = path.join(__dirname, 'templates', 'password_reset.html');
            let html = fs.readFileSync(templatePath, 'utf8');
            html = html.replace('{{name}}', fullName || 'Bạn')
                .replace('{{resetLink}}', resetLink);
            const mailOptions = {
                from: `"Doctor App Support" <${process.env.EMAIL_USER}>`,
                to: toEmail,
                subject: 'Yêu cầu đặt lại mật khẩu',
                html: html
            };
            await this._send(mailOptions);
        } catch (error) {
            console.error("Lỗi đọc template reset password:", error);
        }
    }

    async sendAppointmentConfirmation(toEmail, { patientName, doctorName, time, date }) {
        try {
            const templatePath = path.join(__dirname, 'templates', 'appointment_confirmation.html');
            let html = fs.readFileSync(templatePath, 'utf8');

            html = html.replace('{{patientName}}', patientName)
                .replace('{{doctorName}}', doctorName)
                .replace('{{time}}', time)
                .replace('{{date}}', date);

            const mailOptions = {
                from: `"BookingCare System" <${process.env.EMAIL_USER}>`,
                to: toEmail,
                subject: `📅 Xác nhận lịch khám với BS ${doctorName} - ${date}`,
                html: html
            };

            await this._send(mailOptions);
        } catch (error) {
            console.error("Lỗi đọc template appointment confirmation:", error);
        }
    }
    async sendPaymentSuccessEmail({ to, name, appointmentId, doctorName, date, time, amount, transactionId }) {
        try {
            const templatePath = path.join(__dirname, 'templates', 'payment_success.html');
            let html = fs.readFileSync(templatePath, 'utf8');
            html = html.replace('{{name}}', name)
                .replace('{{appointmentId}}', appointmentId)
                .replace('{{doctorName}}', doctorName)
                .replace('{{date}}', date)
                .replace('{{time}}', time)
                .replace('{{amount}}', amount.toLocaleString('vi-VN'))
                .replace('{{transactionId}}', transactionId);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: `Thanh toán thành công - Lịch hẹn #${appointmentId}`,
                html: html
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Đã gửi mail thanh toán cho: ${to}`);
        } catch (error) {
            console.error("Lỗi gửi email thanh toán:", error);
        }
    }

    async sendPrescriptionEmail(toEmail, { patientName, doctorName, date, symptoms, doctorNotes, prescriptions }) {
        try {
            const templatePath = path.join(__dirname, 'templates', 'prescription_email.html');
            let html = fs.readFileSync(templatePath, 'utf8');

            const prescriptionRows = prescriptions.map(p => `
                <tr>
                    <td><strong>${p.drugName}</strong></td>
                    <td>${p.quantity}</td>
                    <td>${p.usage}</td>
                </tr>
            `).join('');

            const finalRows = prescriptionRows || '<tr><td colspan="3" style="text-align:center">Không có thuốc được kê</td></tr>';

            html = html.replace('{{patientName}}', patientName)
                .replace('{{doctorName}}', doctorName)
                .replace('{{date}}', date)
                .replace('{{symptoms}}', symptoms || 'Không ghi nhận')
                .replace('{{doctorNotes}}', doctorNotes || 'Không có lời dặn thêm')
                .replace('{{prescriptionRows}}', finalRows);

            const mailOptions = {
                from: `"BookingCare System" <${process.env.EMAIL_USER}>`,
                to: toEmail,
                subject: `💊 Đơn thuốc từ BS ${doctorName} - ${date}`,
                html: html
            };

            await this._send(mailOptions);
        } catch (error) {
            console.error("Lỗi gửi email đơn thuốc:", error);
        }
    }
}

module.exports = NodemailerEmailService;