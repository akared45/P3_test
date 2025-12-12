const WorkingDay = Object.freeze({
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
});

class Schedule {
  constructor({ day, start, end, maxPatients = 10 }) {
    if (!Object.values(WorkingDay).includes(day)) {
      throw new Error(`Invalid day: ${day}`);
    }
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(start) || !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(end)) {
      throw new Error('Time must be in HH:MM format');
    }
    this.day = day;
    this.start = start;
    this.end = end;
    this.maxPatients = Number(maxPatients);
    Object.freeze(this);
  }
}
Schedule.Day = WorkingDay;
module.exports = Schedule;