class GetDashboardStatsResponse {
    constructor({ summary, revenueChart, statusDistribution, topDoctors, period }) {
        this.period = {
            from: period.from,
            to: period.to
        };
        this.summary = {
            totalRevenue: summary?.totalRevenue || 0,
            totalAppointments: summary?.totalAppointments || 0,
            totalPatients: summary?.totalPatients || 0,
            totalDoctors: summary?.totalDoctors || 0
        };
        this.charts = {
            revenueOverTime: Array.isArray(revenueChart) ? revenueChart : [],
            statusDistribution: {
                pending: statusDistribution?.pending || 0,
                confirmed: statusDistribution?.confirmed || 0,
                cancelled: statusDistribution?.cancelled || 0,
                done: statusDistribution?.done || 0
            },
            topDoctors: Array.isArray(topDoctors) ? topDoctors.map(doc => ({
                id: doc.doctorId,
                name: doc.name,
                avatar: doc.avatar,
                bookingCount: doc.count || 0,
                totalRevenue: doc.revenue || 0
            })) : []
        };
    }
}

module.exports = GetDashboardStatsResponse;