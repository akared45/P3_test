const IAppointmentRepository = require('../../../../domain/repositories/IAppointmentRepository');
const AppointmentModel = require('../models/AppointmentModel');
const Appointment = require('../../../../domain/entities/Appointment');
const { v4: uuidv4 } = require('uuid');
class MongoAppointmentRepository extends IAppointmentRepository {
    _toDomain(doc) {
       if (!doc) return null;
        const extractUserInfo = (userField) => {
            if (!userField) return { id: null, name: null, avatar: null };
            if (typeof userField === 'object' && userField._id) {
                return {
                    id: userField._id.toString(),
                    name: userField.profile?.fullName || userField.username || 'Unknown',
                    avatar: userField.profile?.avatarUrl || null
                };
            }
            return { id: userField.toString(), name: null, avatar: null };
        };

        const patientInfo = extractUserInfo(doc.patientId);
        console.log(patientInfo);
        const doctorInfo = extractUserInfo(doc.doctorId);

        return new Appointment({
            id: doc._id.toString(),
            patientId: patientInfo.id,
            doctorId: doctorInfo.id,
            patientName: patientInfo.name,
            patientAvatar: patientInfo.avatar,
            doctorName: doctorInfo.name,
            doctorAvatar: doctorInfo.avatar,
            type: doc.type,
            appointmentDate: doc.appointmentDate,
            durationMinutes: doc.durationMinutes,
            status: doc.status,
            symptoms: doc.symptoms,
            doctorNotes: doc.doctorNotes,
            createdAt: doc.createdAt,
            symptomDetails: doc.symptomDetails || [],
            prescriptions: doc.prescriptions || []
        });
    }

    _toPersistence(entity) {
        const start = new Date(entity.appointmentDate);
        const duration = Number(entity.durationMinutes) || 30;
        const end = new Date(start.getTime() + duration * 60000);

        return {
            _id: entity.id,
            patientId: entity.patientId,
            doctorId: entity.doctorId,
            appointmentDate: entity.appointmentDate,
            durationMinutes: duration,
            startTime: start,
            endTime: end,
            type: entity.type,
            status: entity.status,
            symptoms: entity.symptoms,
            doctorNotes: entity.doctorNotes,
            symptomDetails: entity.symptomDetails ? entity.symptomDetails.map(s => ({ ...s })) : [],
            prescriptions: entity.prescriptions ? entity.prescriptions.map(p => ({ ...p })) : []
        };
    }

    async findById(id) {
        const doc = await AppointmentModel.findById(id).lean();
        if (!doc) return null;
        return this._toDomain(doc);
    }

    async save(appointmentEntity) {
        const persistenceData = this._toPersistence(appointmentEntity);
        if (!persistenceData._id) {
            persistenceData._id = uuidv4();
        }
        const savedDoc = await AppointmentModel.findByIdAndUpdate(
            persistenceData._id,
            persistenceData,
            { upsert: true, new: true, runValidators: true }
        ).lean();

        return this._toDomain(savedDoc);
    }

    async findOverlapping(doctorId, queryStart, queryEnd) {
        const conflict = await AppointmentModel.findOne({
            doctorId: doctorId,
            status: { $nin: ['CANCELLED', 'REJECTED'] },
            $and: [
                { startTime: { $lt: queryEnd } },
                { endTime: { $gt: queryStart } }
            ]
        }).lean();

        return !!conflict;
    }

    async findByUserId(userId) {
        const docs = await AppointmentModel.find({
            $or: [
                { patientId: userId },
                { doctorId: userId }
            ]
        })
            .sort({ appointmentDate: -1 })
            .populate('patientId', 'username profile') 
            .populate('doctorId', 'username profile')
            .lean();
        return docs.map(doc => this._toDomain(doc));
    }

    async findBusySlots(doctorId, dateString) {
        const startOfDay = new Date(dateString);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateString);
        endOfDay.setHours(23, 59, 59, 999);

        const docs = await AppointmentModel.find({
            doctorId: doctorId,
            status: { $in: ['pending', 'confirmed', 'in_progress'] },
            startTime: { $gte: startOfDay, $lte: endOfDay }
        })
            .select('startTime endTime')
            .lean();

        return docs;
    }
}

module.exports = MongoAppointmentRepository;