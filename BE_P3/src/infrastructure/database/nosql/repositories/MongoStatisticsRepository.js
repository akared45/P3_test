const IStatisticsRepository = require('../../../../domain/repositories/IStatisticsRepository');
const { UserModel } = require('../models/UserModel'); // Giữ nguyên fix import
const AppointmentModel = require('../models/AppointmentModel');

class MongoStatisticsRepository extends IStatisticsRepository {
    
    async getDashboardSummary() {
        console.log("========== DEBUG: getDashboardSummary ==========");
        
        try {
            // 1. Kiểm tra kết nối Model
            const patientCountTest = await UserModel.countDocuments();
            console.log(`[CHECK] Tổng số User trong DB (mọi loại): ${patientCountTest}`);

            // 2. Chạy query
            const [revenueResult, totalAppointments, totalPatients, totalDoctors] = await Promise.all([
                // A. Doanh thu
                AppointmentModel.aggregate([
                    { $match: { paymentStatus: 'PAID' } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]),
                // B. Tổng lịch
                AppointmentModel.countDocuments(),
                // C. Tổng Patient (Check kỹ xem DB lưu là 'PATIENT' hay 'patient')
                UserModel.countDocuments({ userType: { $regex: new RegExp("^PATIENT$", "i") } }), 
                // D. Tổng Doctor
                UserModel.countDocuments({ userType: { $regex: new RegExp("^DOCTOR$", "i") } })
            ]);

            console.log("1. Revenue Raw Result:", revenueResult); // Nếu rỗng [] nghĩa là không có đơn nào status='PAID'
            console.log("2. Total Appointments:", totalAppointments);
            console.log("3. Total Patients:", totalPatients); // Nếu = 0, check lại field userType trong DB
            console.log("4. Total Doctors:", totalDoctors);

            return {
                totalRevenue: revenueResult.length > 0 ? revenueResult[0].total : 0,
                totalAppointments,
                totalPatients,
                totalDoctors
            };
        } catch (error) {
            console.error("❌ Lỗi trong getDashboardSummary:", error);
            throw error;
        }
    }

    async getRevenueOverTime(startDate, endDate) {
        console.log("========== DEBUG: getRevenueOverTime ==========");
        console.log("Input Start:", startDate);
        console.log("Input End:", endDate);

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

        console.log("📈 Revenue Chart Data:", JSON.stringify(data, null, 2));
        return data;
    }

    async getAppointmentStatusDistribution(startDate, endDate) {
        console.log("========== DEBUG: Status Distribution ==========");
        
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

        console.log("🍰 Pie Chart Raw Data:", data);
        // data sẽ có dạng: [ { _id: 'confirmed', count: 5 }, { _id: 'pending', count: 2 } ]

        const result = {
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0
        };

        data.forEach(item => {
            // Chuyển về chữ thường để khớp key
            const statusKey = item._id ? item._id.toLowerCase() : 'unknown';
            result[statusKey] = item.count;
        });

        console.log("🍰 Pie Chart Final:", result);
        return result;
    }

    async getTopDoctors(limit = 5) {
        console.log("========== DEBUG: Top Doctors ==========");
        
        // 1. Kiểm tra xem có lịch hẹn nào completed không
        const completedCount = await AppointmentModel.countDocuments({ status: 'completed' });
        console.log(`[CHECK] Số lượng lịch 'completed' trong DB: ${completedCount}`);

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
                    from: "users", // ⚠️ LƯU Ý: Tên collection trong MongoDB Compass của bạn là 'users' hay 'Users'?
                    localField: "_id", 
                    foreignField: "_id",
                    as: "doctorInfo"
                }
            },
            // Log ra xem lookup có bắt được user không
            {
                 $project: {
                     doctorId: "$_id",
                     count: 1,
                     revenue: 1,
                     doctorInfoSize: { $size: "$doctorInfo" }, // Debug: xem mảng này có phần tử nào không
                     doctorInfo: 1
                 }
            }
        ]);

        console.log("👨‍⚕️ Top Doctor Raw (Before Process):", JSON.stringify(data, null, 2));

        // Xử lý mapping thủ công ở Javascript thay vì Aggregation đoạn cuối để an toàn hơn khi debug
        const finalResult = data.map(item => {
            const doc = item.doctorInfo[0] || {}; // Lấy phần tử đầu tiên
            const profile = doc.profile || {};
            return {
                doctorId: item._id,
                name: profile.fullName || "Unknown Doctor",
                avatar: profile.avatarUrl || "",
                count: item.count,
                revenue: item.revenue
            };
        });

        console.log("👨‍⚕️ Top Doctor Final:", finalResult);
        return finalResult;
    }
}

module.exports = MongoStatisticsRepository;