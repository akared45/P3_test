const { Action } = require('../enums');

class DoctorPolicy {
    can(actor, action, targetDoctor) {
        if (actor.isAdmin()) {
            return true;
        }
        if (action === Action.READ) {
            return true;
        }
        return false;
    }
}

module.exports = new DoctorPolicy();