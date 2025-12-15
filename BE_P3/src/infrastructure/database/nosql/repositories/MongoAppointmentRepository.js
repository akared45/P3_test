const IAppointmentRepository = require('../../../../domain/repositories/IAppointmentRepository');
const AppointmentModel = require('../models/AppointmentModel');
const AppointmentMapper = require('../mappers/AppointmentMapper');
const { v4: uuidv4 } = require('uuid');

class MongoAppointmentRepository extends IAppointmentRepository {

    async findById(id) {
        const doc = await AppointmentModel.findById(id)
            .populate('patientId', 'profile username email')
            .populate('doctorId', 'profile username email')
            .lean();

        if (!doc) return null;
        return AppointmentMapper.toDomain(doc);
    }

    async save(appointmentEntity) {
        const persistenceData = AppointmentMapper.toPersistence(appointmentEntity);

        if (!persistenceData._id) {
            persistenceData._id = uuidv4();
        }

        const savedDoc = await AppointmentModel.findByIdAndUpdate(
            persistenceData._id,
            persistenceData,
            { upsert: true, new: true, runValidators: true }
        )
            .populate('patientId', 'profile username')
            .populate('doctorId', 'profile username')
            .lean();
        return AppointmentMapper.toDomain(savedDoc);
    }

    async findOverlapping(doctorId, queryStart, queryEnd) {
        const conflict = await AppointmentModel.findOne({
            doctorId: doctorId,
            status: { $nin: ['CANCELLED', 'REJECTED', 'cancelled', 'rejected'] },
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
        return docs.map(doc => AppointmentMapper.toDomain(doc));
    }

    async findBusySlots(doctorId, dateString) {
        const startOfDay = new Date(dateString);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateString);
        endOfDay.setHours(23, 59, 59, 999);

        const docs = await AppointmentModel.find({
            doctorId: doctorId,
            status: { $in: ['pending', 'confirmed', 'in_progress', 'PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
            startTime: { $gte: startOfDay, $lte: endOfDay }
        })
            .select('startTime endTime')
            .lean();

        return docs;
    }
}

module.exports = MongoAppointmentRepository;