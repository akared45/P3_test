const { NotImplementedException } = require('../exceptions');

class IStatisticsRepository {
    async getDashboardSummary() {
        throw new NotImplementedException('IStatisticsRepository.getDashboardSummary');
    }

    async getRevenueOverTime(startDate, endDate, type = 'day') {
        throw new NotImplementedException('IStatisticsRepository.getRevenueOverTime');
    }

    async getAppointmentStatusDistribution(startDate, endDate) {
        throw new NotImplementedException('IStatisticsRepository.getAppointmentStatusDistribution');
    }

    async getTopDoctors(limit = 5) {
        throw new NotImplementedException('IStatisticsRepository.getTopDoctors');
    }
}

module.exports = IStatisticsRepository;