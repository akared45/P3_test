/**
 * IPaymentService - Interface cho các dịch vụ thanh toán
 * Lớp này chỉ định nghĩa các phương thức mà không thực hiện logic cụ thể.
 * Bất kỳ Service nào (VnPay, Momo) kế thừa lớp này đều phải override các hàm dưới đây.
 */
class IPaymentService {
    /**
     * Tạo URL thanh toán để gửi cho người dùng
     * @param {Object} params - { orderId, amount, returnUrl, ipAddr, ... }
     * @returns {Promise<string>} - Link thanh toán
     */
    async createPaymentUrl(params) {
        throw new Error("Method 'createPaymentUrl' must be implemented");
    }

    /**
     * Kiểm tra chữ ký và tính toàn vẹn của dữ liệu nhận được từ cổng thanh toán
     * @param {Object} responseData - Toàn bộ dữ liệu cổng thanh toán gửi về
     * @returns {boolean} - true nếu hợp lệ, false nếu bị giả mạo
     */
    verifySignature(responseData) {
        throw new Error("Method 'verifySignature' must be implemented");
    }
}

module.exports = IPaymentService;