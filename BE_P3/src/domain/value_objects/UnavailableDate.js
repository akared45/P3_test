class UnavailableDate {
  constructor({ date, start = null, end = null, reason = '', allDay = true }) {
    const rawDate = date || start || new Date();
    this.date = rawDate instanceof Date ? rawDate : new Date(rawDate);
    const dateString = this.date.toISOString().split('T')[0];
    if (start) {
      if (start instanceof Date) {
        this.start = start;
      }
      else if (typeof start === 'string') {
        const timeStr = start.length === 5 ? `${start}:00` : start;
        this.start = new Date(`${dateString}T${timeStr}Z`);
      }
    } else {
      this.start = null;
    }
    if (end) {
      if (end instanceof Date) {
        this.end = end;
      } else if (typeof end === 'string') {
        const timeStr = end.length === 5 ? `${end}:00` : end;
        this.end = new Date(`${dateString}T${timeStr}Z`);
      }
    } else {
      this.end = null;
    }
    this.reason = reason?.trim() || '';
    this.allDay = Boolean(allDay);
    if (this.start && this.end && !allDay) {
      this.allDay = false;
    }
    Object.freeze(this);
  }

  includes(dateToCheck) {
    const d = new Date(dateToCheck);
    if (!this.allDay && this.start && this.end) {
      return d.getTime() >= this.start.getTime() && d.getTime() <= this.end.getTime();
    }
    const checkYMD = d.toISOString().split('T')[0];
    const thisYMD = this.date.toISOString().split('T')[0];
    if (checkYMD === thisYMD) return true;
    if (this.start && this.end) {
      return d.getTime() >= this.start.getTime() && d.getTime() <= this.end.getTime();
    }

    return false;
  }
}

module.exports = UnavailableDate;