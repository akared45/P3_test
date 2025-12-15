const Appointment = require('../../../../domain/entities/Appointment');

class AppointmentMapper {
    static toDomain(doc) {
        if (!doc) return null;
        const extractUserInfo = (userField) => {
            if (!userField) return { id: null, name: null, avatar: null };
            if (typeof userField === 'object' && userField._id) {
                return {
                    id: userField._id.toString(),
                    name: userField.profile?.fullName || userField.username || 'Unknown',
                    avatar: userField.profile?.avatarUrl || null,
                    email: userField.email || null
                };
            }
            return { id: userField.toString(), name: null, avatar: null, email: null };
        };

        const patientInfo = extractUserInfo(doc.patientId);
        const doctorInfo = extractUserInfo(doc.doctorId);

        return new Appointment({
            id: doc._id.toString(),
            patientId: patientInfo.id,
            doctorId: doctorInfo.id,
            patientName: doc.patientName || patientInfo.name,
            patientAvatar: doc.patientAvatar || patientInfo.avatar,
            doctorName: doc.doctorName || doctorInfo.name,
            doctorAvatar: doc.doctorAvatar || doctorInfo.avatar,
            type: doc.type,
            appointmentDate: doc.appointmentDate,
            durationMinutes: doc.durationMinutes,
            status: doc.status,
            symptoms: doc.symptoms,
            doctorNotes: doc.doctorNotes,
            symptomDetails: doc.symptomDetails || [],
            prescriptions: (doc.prescriptions || []).map(p => ({
                drugName: p.drugName,
                quantity: p.quantity,
                usage: p.usage,
                medicationCode: p.medicationCode,
                instructions: p.instructions
            })),
            amount: doc.amount,
            paymentStatus: doc.paymentStatus,
            paymentMethod: doc.paymentMethod,
            transactionId: doc.transactionId,
            paymentUrl: doc.paymentUrl,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    static toPersistence(entity) {
        const start = new Date(entity.appointmentDate);
        const duration = Number(entity.durationMinutes) || 30;
        const end = new Date(start.getTime() + duration * 60000);

        return {
            _id: entity.id,
            patientId: entity.patientId,
            doctorId: entity.doctorId,
            patientName: entity.patientName,
            doctorName: entity.doctorName,
            appointmentDate: entity.appointmentDate,
            durationMinutes: duration,
            startTime: start,
            endTime: end,
            type: (entity.type || 'chat').toLowerCase(),
            status: (entity.status || 'pending').toLowerCase(),
            symptoms: entity.symptoms,
            doctorNotes: entity.doctorNotes,
            symptomDetails: entity.symptomDetails ? entity.symptomDetails.map(s => ({ ...s })) : [],
            prescriptions: entity.prescriptions.map(p => ({
                drugName: p.drugName,
                quantity: p.quantity,
                usage: p.usage,
                medicationCode: p.medicationCode,
                instructions: p.instructions
            })),
            amount: entity.amount,
            paymentStatus: entity.paymentStatus,
            paymentMethod: entity.paymentMethod,
            transactionId: entity.transactionId,
            paymentUrl: entity.paymentUrl
        };
    }
}

module.exports = AppointmentMapper;