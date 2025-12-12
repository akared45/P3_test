class Money {
  constructor(amount, currency = 'VND') {
    if (amount < 0) throw new Error("Money cannot be negative");
    this.amount = Number(amount);
    this.currency = currency;
    Object.freeze(this);
  }

  format() {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: this.currency
    }).format(this.amount);
  }
}

module.exports = Money;