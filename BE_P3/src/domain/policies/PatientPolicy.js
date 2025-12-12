const { Action } = require('../enums');

class PatientPolicy {
    can(actor, action, targetPatient) {
        if (actor.isAdmin()) {
            if (action === Action.READ || action === Action.DELETE) {
                return true;
            }
            return false;
        }

        if (actor.isDoctor()) {
            if (action === Action.READ) {
                return true;
            }
            return false;
        }

        if (actor.isPatient()) {
            const isOwner = targetPatient && targetPatient.id.toString() === actor.id.toString();
            if (isOwner) {
                if (action === Action.READ) return true;
                if (action === Action.UPDATE) return true;
            }
            return false;
        }
        return false;
    }
}

module.exports = new PatientPolicy();