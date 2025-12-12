const { NotImplementedException } = require('../../domain/exceptions');

class IAuthenticationService {
    async hash(password) {
        throw new NotImplementedException('IAuthenticationService.hash');
    }

    async compare(plainText, encrypted) {
        throw new NotImplementedException('IAuthenticationService.compare');
    }
}

module.exports = IAuthenticationService;