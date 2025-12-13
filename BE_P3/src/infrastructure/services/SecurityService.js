const crypto = require('crypto');
const ISecurityService = require('../../application/interfaces/ISecurityService');

class SecurityService extends ISecurityService {
    generateSecureRandomToken() {
        return crypto.randomBytes(32).toString('hex');
    }
}

module.exports = SecurityService;