const DomainException = require("./DomainException");

class NotImplementedException extends DomainException {
  constructor(methodName = 'Method') {
     super(`${methodName} is not implemented`, 'NOT_IMPLEMENTED', 501);
  }
}

module.exports = NotImplementedException;
