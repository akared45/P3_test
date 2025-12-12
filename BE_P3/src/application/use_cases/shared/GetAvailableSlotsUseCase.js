const { NotFoundException } = require('../../../domain/exceptions');

class GetAvailableSlotsUseCase {
    static SLOT_DURATION = 30;

    constructor({ userRepository, appointmentRepository }) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    async execute({ doctorId, date }) {
        const doctor = await this.userRepository.findById(doctorId);
        if (!doctor) throw new NotFoundException("Doctor not found");
        const requestDate = new Date(date);
        const doctorTimeZone = doctor.timeZone || 'Asia/Ho_Chi_Minh';
        const dayName = requestDate.toLocaleDateString('en-US', {
            timeZone: doctorTimeZone, weekday: 'long'
        });

        const schedule = doctor.schedules.find(s => s.day === dayName);
        if (!schedule) return [];
        const bookedApps = await this.appointmentRepository.getBookedAppointments(doctorId, date);
        const bookedTimes = bookedApps.map(app => app.appointmentDate.getTime());
        const availableSlots = [];
        const startHour = parseInt(schedule.start.split(':')[0]);
        const startMin = parseInt(schedule.start.split(':')[1]);
        const endHour = parseInt(schedule.end.split(':')[0]);
        const endMin = parseInt(schedule.end.split(':')[1]);
        let currentSlot = new Date(date);
        currentSlot.setHours(startHour - 7, startMin, 0, 0);
        const startTimeInMinutes = startHour * 60 + startMin;
        const endTimeInMinutes = endHour * 60 + endMin;

        for (let time = startTimeInMinutes; time < endTimeInMinutes; time += GetAvailableSlotsUseCase.SLOT_DURATION) {
            const slotDate = new Date(date);
            const h = Math.floor(time / 60);
            const m = time % 60;
            slotDate.setUTCHours(h - 7, m, 0, 0);
            const isBooked = bookedTimes.some(bookedTime => Math.abs(bookedTime - slotDate.getTime()) < 60000);

            if (!isBooked) {
                if (slotDate > new Date()) {
                    availableSlots.push(slotDate.toISOString());
                }
            }
        }

        return availableSlots;
    }
}

module.exports = GetAvailableSlotsUseCase;