const { NotImplementedException } = require('../../domain/exceptions');
class ISecurityService {
    generateSecureRandomToken() { throw new NotImplementedException(); }
}
module.exports = ISecurityService;