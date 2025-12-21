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

        // Render từng dòng thuốc với cấu trúc dữ liệu mới
        const prescriptionRows = prescriptions.map(p => {
            // 1. Tính tổng số lượng thuốc cần mua/uống
            const dailyTotal = (p.dosage?.morning || 0) + (p.dosage?.afternoon || 0) + (p.dosage?.evening || 0);
            const totalQuantity = dailyTotal * (p.duration || 0);

            // 2. Định dạng chuỗi hướng dẫn (Sáng - Trưa - Tối)
            const dosageDetail = `Sáng: ${p.dosage?.morning || 0}, Trưa: ${p.dosage?.afternoon || 0}, Tối: ${p.dosage?.evening || 0}`;
            const durationText = `Dùng trong ${p.duration} ngày`;
            const noteText = p.note ? `<br/><i style="color: #666;">Ghi chú: ${p.note}</i>` : '';

            return `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">
                        <strong style="color: #1976d2;">${p.drugName}</strong>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                        ${totalQuantity} viên/gói
                    </td>
                    <td style="padding: 10px;">
                        <div>${dosageDetail}</div>
                        <div style="font-size: 0.85em; color: #555;">${durationText}</div>
                        ${noteText}
                    </td>
                </tr>
            `;
        }).join('');

        const finalRows = prescriptionRows || '<tr><td colspan="3" style="text-align:center; padding: 20px;">Không có thuốc được kê</td></tr>';

        html = html.replace('{{patientName}}', patientName)
            .replace('{{doctorName}}', doctorName)
            .replace('{{date}}', date)
            .replace('{{symptoms}}', symptoms || 'Không ghi nhận')
            .replace('{{doctorNotes}}', doctorNotes || 'Nghỉ ngơi, uống nhiều nước và tái khám nếu có dấu hiệu bất thường.')
            .replace('{{prescriptionRows}}', finalRows);

        const mailOptions = {
            from: `"BookingCare System" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `💊 ĐƠN THUỐC ĐIỆN TỬ - BS ${doctorName.toUpperCase()} - ${date}`,
            html: html
        };

        await this._send(mailOptions);
        console.log(`Email đơn thuốc đã được gửi tới: ${toEmail}`);
    } catch (error) {
        console.error("Lỗi gửi email đơn thuốc:", error);
    }
}
}

module.exports = NodemailerEmailService;