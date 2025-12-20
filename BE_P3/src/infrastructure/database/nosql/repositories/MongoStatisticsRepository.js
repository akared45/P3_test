const IStatisticsRepository = require('../../../../domain/repositories/IStatisticsRepository');
const { UserModel } = require('../models/UserModel'); // Giữ nguyên fix import
const AppointmentModel = require('../models/AppointmentModel');

class MongoStatisticsRepository extends IStatisticsRepository {

    async getDashboardSummary() {
        console.log("========== DEBUG: getDashboardSummary ==========");

        try {
            const patientCountTest = await UserModel.countDocuments();

            const [revenueResult, totalAppointments, totalPatients, totalDoctors] = await Promise.all([
                AppointmentModel.aggregate([
                    { $match: { paymentStatus: 'PAID' } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]),
                AppointmentModel.countDocuments(),
                UserModel.countDocuments({ userType: { $regex: new RegExp("^PATIENT$", "i") } }),
                UserModel.countDocuments({ userType: { $regex: new RegExp("^DOCTOR$", "i") } })
            ]);

            console.log("1. Revenue Raw Result:", revenueResult);
            console.log("2. Total Appointments:", totalAppointments);
            console.log("3. Total Patients:", totalPatients);
            console.log("4. Total Doctors:", totalDoctors);

            return {
                totalRevenue: revenueResult.length > 0 ? revenueResult[0].total : 0,
                totalAppointments,
                totalPatients,
                totalDoctors
            };
        } catch (error) {
            console.error("getDashboardSummary:", error);
            throw error;
        }
    }

    async getRevenueOverTime(startDate, endDate) {
        const data = await AppointmentModel.aggregate([
            {
                $match: {
                    appointmentDate: { $gte: startDate, $lte: endDate },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
                    revenue: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$amount", 0]
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: "$_id",
                    revenue: 1,
                    count: 1,
                    _id: 0
                }
            }
        ]);
        return data;
    }

    async getAppointmentStatusDistribution(startDate, endDate) {
        const data = await AppointmentModel.aggregate([
            {
                $match: {
                    appointmentDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0
        };

        data.forEach(item => {
            const statusKey = item._id ? item._id.toLowerCase() : 'unknown';
            result[statusKey] = item.count;
        });

        return result;
    }

    async getTopDoctors(limit = 5) {
        const data = await AppointmentModel.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: "$doctorId",
                    count: { $sum: 1 },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctorInfo"
                }
            },
            {
                $project: {
                    doctorId: "$_id",
                    count: 1,
                    revenue: 1,
                    doctorInfoSize: { $size: "$doctorInfo" },
                    doctorInfo: 1
                }
            }
        ]);

        const finalResult = data.map(item => {
            const doc = item.doctorInfo[0] || {};
            const profile = doc.profile || {};
            return {
                doctorId: item._id,
                name: profile.fullName || "Unknown Doctor",
                avatar: profile.avatarUrl || "",
                count: item.count,
                revenue: item.revenue
            };
        });
        return finalResult;
    }
}

module.exports = MongoStatisticsRepository;