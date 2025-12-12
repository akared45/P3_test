class Specialization {
  constructor({
    code,
    name,
    category,
    isDeleted = false
  }) {
    if (!code) throw new Error("Specialization code is required");
    if (!name) throw new Error("Specialization name is required");

    this.code = code;
    this.name = name;
    this.category = category;
    this.isDeleted = Boolean(isDeleted);
    Object.freeze(this);
  }
  
  update({ name, category }) {
    return new Specialization({
      ...this,
      name: name || this.name,
      category: category || this.category
    });
  }

  markDeleted() {
    return new Specialization({
      ...this,
      isDeleted: true
    });
  }
}

module.exports = Specialization;