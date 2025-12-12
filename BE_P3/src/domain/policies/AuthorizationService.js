const { Resource } = require('../enums');
const PatientPolicy = require('./PatientPolicy');
const DoctorPolicy = require('./DoctorPolicy');
const MedicalRecordPolicy = require('./MedicalRecordPolicy');

class AuthorizationService {
    constructor() {
        this.policies = {
            [Resource.PATIENT]: PatientPolicy,
            [Resource.DOCTOR]: DoctorPolicy,
            [Resource.MEDICAL_RECORD]: MedicalRecordPolicy,
        };
    }

    can(actor, action, resource, target = null) {
        const policy = this.policies[resource];
        if (!policy) {
            console.warn(`No policy found for resource: ${resource}`);
            return false;
        }
        return policy.can(actor, action, target);
    }
}

module.exports = AuthorizationService;