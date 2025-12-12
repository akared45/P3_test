const DomainException = require("./DomainException");

class UnauthorizedException extends DomainException {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHORIZED', 401);
  }
}
module.exports = UnauthorizedException;