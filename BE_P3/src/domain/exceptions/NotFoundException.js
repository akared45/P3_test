const DomainException = require('./DomainException');

class NotFoundException extends DomainException {
  constructor(entity = 'Resource') {
    super(`${entity} does not exist`, 'NOT_FOUND', 404);
  }
}
module.exports = NotFoundException;
