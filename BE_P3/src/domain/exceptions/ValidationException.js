const DomainException = require('./DomainException');

class ValidationException extends DomainException {
  constructor(message = 'Invalid data', errors = []) {
    super(message, 'VALIDATION_ERROR', 400);
    this.errors = errors; 
  }
}
module.exports = ValidationException;
