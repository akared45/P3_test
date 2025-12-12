const DomainException = require('./DomainException');

class BusinessRuleException extends DomainException {
  constructor(message, code = 'BUSINESS_RULE_VIOLATION') {
    super(message, code, 422);
  }
}
module.exports = BusinessRuleException;