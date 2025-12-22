const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const IEmailService = require("../../domain/services/IEmailService");

class NodemailerEmailService extends IEmailService {
    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
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
            const templatePath = path.join(__dirname, "templates", "verification_email.html");
            let html = fs.readFileSync(templatePath, "utf8");
            html = html.replace("{{verificationLink}}", verificationLink);
            const mailOptions = {
                from: `"Doctor App" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: "Doctor App Account Verification",
                html: html,
            };
            await this._send(mailOptions);
        } catch (error) {
            console.error("Error reading verification template:", error);
        }
    }

    async sendPasswordResetEmail(toEmail, resetLink, fullName) {
        try {
            const templatePath = path.join(__dirname, "templates", "password_reset.html");
            let html = fs.readFileSync(templatePath, "utf8");
            html = html.replace("{{name}}", fullName || "You").replace("{{resetLink}}", resetLink);
            const mailOptions = {
                from: `"Doctor App Support" <${process.env.EMAIL_USER}>`,
                to: toEmail,
                subject: "Password Reset Request",
                html: html,
            };
            await this._send(mailOptions);
        } catch (error) {
            console.error("Error reading reset password template:", error);
        }
    }

    async sendAppointmentConfirmation(toEmail, { patientName, doctorName, time, date }) {
        try {
            const templatePath = path.join(__dirname, "templates", "appointment_confirmation.html");
            let html = fs.readFileSync(templatePath, "utf8");

            html = html
                .replace("{{patientName}}", patientName)
                .replace("{{doctorName}}", doctorName)
                .replace("{{time}}", time)
                .replace("{{date}}", date);

            const mailOptions = {
                from: `"BookingCare System" <${process.env.EMAIL_USER}>`,
                to: toEmail,
                subject: `📅 Appointment Confirmation with Dr. ${doctorName} - ${date}`,
                html: html,
            };

            await this._send(mailOptions);
        } catch (error) {
            console.error("Error reading appointment confirmation template:", error);
        }
    }

    async sendPaymentSuccessEmail({ to, name, appointmentId, doctorName, date, time, amount, transactionId }) {
        try {
            const templatePath = path.join(__dirname, "templates", "payment_success.html");
            let html = fs.readFileSync(templatePath, "utf8");
            html = html
                .replace("{{name}}", name)
                .replace("{{appointmentId}}", appointmentId)
                .replace("{{doctorName}}", doctorName)
                .replace("{{date}}", date)
                .replace("{{time}}", time)
                .replace("{{amount}}", amount.toLocaleString("vi-VN"))
                .replace("{{transactionId}}", transactionId);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: `Payment Successful - Appointment #${appointmentId}`,
                html: html,
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Payment email sent to: ${to}`);
        } catch (error) {
            console.error("Error sending payment email:", error);
        }
    }

    async sendPrescriptionEmail(toEmail, { patientName, doctorName, date, symptoms, doctorNotes, prescriptions }) {
        try {
            const templatePath = path.join(__dirname, "templates", "prescription_email.html");
            let html = fs.readFileSync(templatePath, "utf8");

            const prescriptionRows = prescriptions
                .map((p) => {
                    const dailyTotal = (p.dosage?.morning || 0) + (p.dosage?.afternoon || 0) + (p.dosage?.evening || 0);
                    const totalQuantity = dailyTotal * (p.duration || 0);
                    const dosageDetail = `Morning: ${p.dosage?.morning || 0}, Afternoon: ${p.dosage?.afternoon || 0}, Evening: ${p.dosage?.evening || 0}`;
                    const durationText = `Take for ${p.duration} days`;
                    const noteText = p.note ? `<br/><i style="color: #666;">Note: ${p.note}</i>` : "";

                    return `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px;"><strong style="color: #1976d2;">${p.drugName}</strong></td>
              <td style="padding: 10px; text-align: center;">${totalQuantity}</td>
              <td style="padding: 10px;">
                <div>${dosageDetail}</div>
                <div style="font-size: 0.85em; color: #555;">${durationText}</div>
                ${noteText}
              </td>
            </tr>
          `;
                })
                .join("");

            const finalRows =
                prescriptionRows ||
                '<tr><td colspan="3" style="text-align:center; padding: 20px;">No medications prescribed</td></tr>';

            html = html
                .replace("{{patientName}}", patientName)
                .replace("{{doctorName}}", doctorName)
                .replace("{{date}}", date)
                .replace("{{symptoms}}", symptoms || "Not recorded")
                .replace("{{doctorNotes}}", doctorNotes || "Rest, drink plenty of water, and revisit if abnormal symptoms occur.")
                .replace("{{prescriptionRows}}", finalRows);

            const mailOptions = {
                from: `"BookingCare System" <${process.env.EMAIL_USER}>`,
                to: toEmail,
                subject: `💊 E-Prescription - Dr. ${doctorName.toUpperCase()} - ${date}`,
                html: html,
            };

            await this._send(mailOptions);
            console.log(`Prescription email sent to: ${toEmail}`);
        } catch (error) {
            console.error("Error sending prescription email:", error);
        }
    }
}

module.exports = NodemailerEmailService;
