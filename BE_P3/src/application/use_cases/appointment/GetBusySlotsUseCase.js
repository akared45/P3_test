class GetBusySlotsUseCase {
    constructor({ appointmentRepository }) {
        this.appointmentRepository = appointmentRepository;
    }

    async execute({ doctorId, date }) {
        if (!doctorId) {
            throw new Error("Doctor ID is required");
        }
        if (!date) {
            throw new Error("Date is required (YYYY-MM-DD)");
        }
        const appointments = await this.appointmentRepository.findBusySlots(doctorId, date);
        const busySlots = appointments.map((app) => {
            const startRaw = app.startTime || app.appointmentDate;
            const endRaw = app.endTime;
            if (!startRaw || !endRaw) return null;
            const startObj = new Date(startRaw);
            const endObj = new Date(endRaw);
            if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) return null;
            return {
                startTime: startObj.toISOString(),
                endTime: endObj.toISOString()
            };
        });
        return busySlots.filter(Boolean);
    }
}

module.exports = GetBusySlotsUseCase;