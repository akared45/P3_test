class GetDashboardStatsRequest {
    constructor({ startDate, endDate }) {
        if (!startDate || !endDate) {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 30);
            
            this.startDate = start;
            this.endDate = end;
        } else {
            this.startDate = new Date(startDate);
            this.endDate = new Date(endDate);
        }
    }
}

module.exports = GetDashboardStatsRequest;