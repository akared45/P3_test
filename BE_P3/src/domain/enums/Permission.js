const Action = Object.freeze({
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
});

const Resource = Object.freeze({
    USER: 'user',
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    MEDICAL_RECORD: 'medical_record',
    APPOINTMENT: 'appointment',
    SYSTEM: 'system'
});

module.exports = {
    Action,
    Resource
};