const { NotImplementedException } = require('../exceptions'); 

class IEmailService {
    async sendVerificationEmail(to, verificationLink) {
        throw new NotImplementedException('IEmailService.sendVerificationEmail');
    }

    async sendPasswordResetEmail(toEmail, resetLink, fullName) {
        throw new NotImplementedException('IEmailService.sendPasswordResetEmail');
    }
    
    async sendAppointmentConfirmation(toEmail, appointmentDetails) {
        throw new NotImplementedException('IEmailService.sendAppointmentConfirmation');
    }
}

module.exports = IEmailService;