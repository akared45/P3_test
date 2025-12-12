const { Action } = require('../enums');

class MedicalRecordPolicy {
    can(actor, action, target) {
        if (actor.isAdmin()) return true;
        if (actor.isDoctor()) {
            if ([Action.CREATE, Action.READ, Action.UPDATE].includes(action)) {
                return true;
            }
            return false;
        }
        if (actor.isPatient()) {
            if (action === Action.READ) {
                return target && target.patientId === actor.id.toString();
            }
            return false;
        }

        return false;
    }
}

module.exports = new MedicalRecordPolicy();