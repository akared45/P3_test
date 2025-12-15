const crypto = require('crypto');
const axios = require('axios');
const IMomoPaymentService = require('../../domain/services/IMomoPaymentService');

class MomoPaymentService extends IMomoPaymentService {
    constructor() {
        super();
        this.partnerCode = process.env.MOMO_PARTNER_CODE;
        this.accessKey = process.env.MOMO_ACCESS_KEY;
        this.secretKey = process.env.MOMO_SECRET_KEY;
        this.endpoint = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
    }

    async createPaymentUrl({ orderId, amount, orderInfo, returnUrl, notifyUrl }) {
        const requestId = orderId;
        const requestType = "captureWallet";
        const extraData = "";
        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = crypto.createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: this.partnerCode,
            partnerName: "Test BookingCare",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: returnUrl,
            ipnUrl: notifyUrl,
            lang: "vi",
            requestType: requestType,
            autoCapture: true,
            extraData: extraData,
            signature: signature
        };

        try {
            const response = await axios.post(this.endpoint, requestBody);

            if (response.data.resultCode !== 0) {
                throw new Error(response.data.message || 'Lỗi tạo link MoMo');
            }

            return response.data.payUrl;
        } catch (error) {
            console.error("Momo Error:", error.response?.data || error.message);
            throw new Error("Tạo thanh toán MoMo thất bại");
        }
    }

    verifySignature(data) {
        const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = data;

        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

        const mySignature = crypto.createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        return mySignature === signature;
    }
}

module.exports = MomoPaymentService;