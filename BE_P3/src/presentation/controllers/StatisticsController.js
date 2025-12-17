class StatisticsController {
    constructor({ getDashboardStatsUseCase }) {
        this.getDashboardStatsUseCase = getDashboardStatsUseCase;
    }

    getDashboardStats = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;

            const result = await this.getDashboardStatsUseCase.execute({
                startDate,
                endDate
            });

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = StatisticsController;