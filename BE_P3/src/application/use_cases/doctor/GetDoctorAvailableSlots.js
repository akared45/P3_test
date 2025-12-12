const { fromZonedTime } = require('date-fns-tz');

class GetDoctorAvailableSlots {
    constructor({ userRepository, appointmentRepository }) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    async execute({ doctorId, dateString }) {
        const doctor = await this.userRepository.findById(doctorId);
        if (!doctor) throw new Error('Doctor not found');
        const timeZone = doctor.timeZone;
        const dummyDate = new Date(dateString);
        const dayName = dummyDate.toLocaleDateString('en-US', {
            timeZone: timeZone,
            weekday: 'long'
        });
        const schedule = doctor.schedules.find(s => s.day === dayName);
        if (!schedule || doctor.isAvailableOn(dummyDate) === false) {
            return [];
        }
        const slots = [];
        const duration = 30;
        const timeToMin = (str) => {
            const [h, m] = str.split(':').map(Number);
            return h * 60 + m;
        };

        let currentMin = timeToMin(schedule.start);
        const endMin = timeToMin(schedule.end);

        while (currentMin + duration <= endMin) {
            const h = Math.floor(currentMin / 60);
            const m = currentMin % 60;
            const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            const dateTimeString = `${dateString} ${timeStr}`;
            const utcDate = fromZonedTime(dateTimeString, timeZone);
            slots.push(utcDate);
            currentMin += duration;
        }

        const dayStart = slots[0];
        const dayEnd = new Date(slots[slots.length - 1].getTime() + duration * 60000);

        const bookedAppointments = await this.appointmentRepository.getBookedSlots(
            doctorId,
            dayStart,
            dayEnd
        );

        const availableSlots = slots.filter(slotTime => {
            const slotEnd = new Date(slotTime.getTime() + duration * 60000);
            const isBooked = bookedAppointments.some(appt => {
                return (appt.startTime < slotEnd && appt.endTime > slotTime);
            });

            return !isBooked;
        });

        return availableSlots.map(date => date.toISOString());
    }
}

module.exports = GetDoctorAvailableSlots;