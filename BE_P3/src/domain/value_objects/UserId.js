class UserId {
  constructor(id) {
    if (id instanceof UserId) {
      this.value = id.value;
    }

    else if (typeof id === 'string' && id.length > 0) {
      this.value = id;
    }
    else {
      throw new Error("UserId must be a non-empty string or a UserId instance");
    }

    Object.freeze(this);
  }

  toString() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }
}

module.exports = UserId;