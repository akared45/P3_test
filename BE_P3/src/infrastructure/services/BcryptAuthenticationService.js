const bcrypt = require("bcryptjs");
const IAuthenticationService = require("../../application/interfaces/IAuthenticationService");

class BcryptAuthenticationService extends IAuthenticationService {
  constructor() {
    super();
    this.saltRounds = 10;
  }

  async hash(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(plainText, encrypted) {
    return await bcrypt.compare(plainText, encrypted);
  }
}

module.exports = BcryptAuthenticationService;