const DomainException = require('./DomainException');

class AuthorizationException extends DomainException {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 'FORBIDDEN', 403);
  }
}
module.exports = AuthorizationException;


