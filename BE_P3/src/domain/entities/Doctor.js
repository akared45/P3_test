const User = require('./User');
const { Schedule, UnavailableDate } = require('../value_objects');
const { UserType } = require('../enums');

class Doctor extends User {
  constructor(data) {
    super({
      ...data,
      userType: UserType.DOCTOR,
      profile: data.profile || {},
      isEmailVerified: data.isEmailVerified
    });

    this.licenseNumber = data.licenseNumber;
    this.specCode = data.specCode;
    this.specializationName = data.specializationName || '';
    this.bio = data.bio?.trim() || '';
    this.qualifications = data.qualifications || [];
    this.workHistory = data.workHistory || [];
    this.rating = Number(data.rating) || 0;
    this.reviewCount = Number(data.reviewCount) || 0;
    this.schedules = (data.schedules || []).map(s => s instanceof Schedule ? s : new Schedule(s));
    this.unavailableDates = (data.unavailableDates || []).map(d => d instanceof UnavailableDate ? d : new UnavailableDate(d));
    this.timeZone = data.timeZone || 'Asia/Ho_Chi_Minh';
    this.yearsExperience = this._calculateYearsExperience();

    Object.freeze(this);
  }

  _calculateYearsExperience() {
    if (!this.workHistory || this.workHistory.length === 0) return 0;
    let totalMilliseconds = 0;
    const now = new Date();
    this.workHistory.forEach(job => {
      const start = new Date(job.from);
      const end = job.to ? new Date(job.to) : now;
      if (start < end) {
        totalMilliseconds += (end - start);
      }
    });
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
    return Math.floor(totalMilliseconds / millisecondsPerYear);
  }

  isAvailableOn(dateObj) {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return false;
    const dayName = getWeekdayInTimezone(dateObj, this.timeZone);
    const hasSchedule = this.schedules.some(s => s.day === dayName);
    const isUnavailable = this.unavailableDates.some(u => u.includes(dateObj));
    return hasSchedule && !isUnavailable;
  }

  isWorkingAt(startTime, durationMinutes) {
    if (!this.isAvailableOn(startTime)) return false;
    const dayName = getWeekdayInTimezone(startTime, this.timeZone);
    const schedule = this.schedules.find(s => s.day === dayName);
    if (!schedule) return false;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    const reqStartStr = getTimeStringInTimezone(startTime, this.timeZone);
    const reqEndStr = getTimeStringInTimezone(endTime, this.timeZone);
    const scheduleStartMin = timeToMinutes(schedule.start);
    const scheduleEndMin = timeToMinutes(schedule.end);
    const reqStartMin = timeToMinutes(reqStartStr);
    const reqEndMin = timeToMinutes(reqEndStr);
    if (reqEndMin < reqStartMin) return false;
    return reqStartMin >= scheduleStartMin && reqEndMin <= scheduleEndMin;
  }

  updateDetails(data) {
    const { contacts, ...otherData } = data;
    return new Doctor({
      ...this,
      contacts: contacts || this.contacts,
      id: this.id,
      isActive: otherData.isActive !== undefined ? otherData.isActive : this.isActive,
      licenseNumber: otherData.licenseNumber || this.licenseNumber,
      specCode: otherData.specCode || this.specCode,
      bio: otherData.bio || this.bio,
      qualifications: otherData.qualifications || this.qualifications,
      workHistory: otherData.workHistory || this.workHistory,
      schedules: otherData.schedules || this.schedules,
      timeZone: otherData.timeZone || this.timeZone,
      profile: {
        ...this.profile,
        fullName: otherData.fullName || this.profile.fullName,
        avatarUrl: otherData.avatarUrl || this.profile.avatarUrl
      }
    });
  }
}

function timeToMinutes(timeString) {
  if (!timeString || typeof timeString !== 'string') return -1;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function getWeekdayInTimezone(dateObj, timeZone) {
  return dateObj.toLocaleDateString('en-US', {
    timeZone: timeZone,
    weekday: 'long'
  });
}

function getTimeStringInTimezone(dateObj, timeZone) {
  return dateObj.toLocaleTimeString('en-US', {
    timeZone: timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
}

module.exports = Doctor;