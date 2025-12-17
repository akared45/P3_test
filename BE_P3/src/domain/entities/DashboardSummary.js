class DashboardSummary {
    constructor({ 
        totalRevenue = 0, 
        totalAppointments = 0, 
        totalPatients = 0, 
        totalDoctors = 0,
        growthRate = 0
    }) {
        this.totalRevenue = totalRevenue;
        this.totalAppointments = totalAppointments;
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.growthRate = growthRate;
    }
}

module.exports = DashboardSummary;