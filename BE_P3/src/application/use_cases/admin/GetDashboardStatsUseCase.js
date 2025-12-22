const GetDashboardStatsRequest = require('../../dtos/admin/GetDashboardStatsRequest');
const GetDashboardStatsResponse = require('../../dtos/admin/GetDashboardStatsResponse');

class GetDashboardStatsUseCase {
    constructor({ statisticsRepository }) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute(rawRequest) {
        const request = new GetDashboardStatsRequest(rawRequest);
        const { startDate, endDate } = request;

        const [
            summary,
            revenueChart,
            statusDistribution,
            topDoctors
        ] = await Promise.all([
            this.statisticsRepository.getDashboardSummary(),
            this.statisticsRepository.getRevenueOverTime(startDate, endDate),
            this.statisticsRepository.getAppointmentStatusDistribution(startDate, endDate),
            this.statisticsRepository.getTopDoctors(5)
        ]);

        return new GetDashboardStatsResponse({
            period: { from: startDate, to: endDate },
            summary,
            revenueChart,
            statusDistribution,
            topDoctors
        });
    }
}

module.exports = GetDashboardStatsUseCase;