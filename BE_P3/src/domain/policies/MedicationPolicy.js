const { Action } = require('../enums');

class MedicationPolicy {
    can(actor, action) {
        if (!actor) return false;

        const isAdmin = (typeof actor.isAdmin === 'function') ? actor.isAdmin() : actor.role === 'admin';
        const isDoctor = (typeof actor.isDoctor === 'function') ? actor.isDoctor() : actor.role === 'doctor';

        if (isAdmin) return true;

        if (action === Action.READ) {
            return isDoctor || actor.role === 'patient';
        }

        return false;
    }
}

module.exports = new MedicationPolicy();