const crypto = require("crypto");
const { format } = require('date-fns');
const IPaymentService = require('../../domain/services/IPaymentService');

class VnPayPaymentService extends IPaymentService {
    constructor() {
        super();
        this.tmnCode = (process.env.VNP_TMN_CODE || "").trim();
        this.secretKey = (process.env.VNP_HASH_SECRET || "").trim();
        this.vnpUrl = (process.env.VNP_URL || "").trim();
    }

    async createPaymentUrl({ orderId, amount, returnUrl, ipAddr }) {
        const createDate = format(new Date(), 'yyyyMMddHHmmss');
        const orderInfo = `Payment_for_appointment_${orderId}`;

        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': this.tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': orderInfo,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr || '13.160.92.202',
            'vnp_CreateDate': createDate,
        };

        vnp_Params = this.sortObject(vnp_Params);
        let signData = "";
        let isFirst = true;

        for (let key in vnp_Params) {
            if (vnp_Params.hasOwnProperty(key)) {
                let value = vnp_Params[key];

                let encodedKey = encodeURIComponent(key);
                let encodedValue = encodeURIComponent(value).replace(/%20/g, "+");

                if (isFirst) {
                    signData += encodedKey + "=" + encodedValue;
                    isFirst = false;
                } else {
                    signData += "&" + encodedKey + "=" + encodedValue;
                }
            }
        }

        const hmac = crypto.createHmac("sha512", this.secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        return `${this.vnpUrl}?${signData}&vnp_SecureHash=${signed}`;
    }

    sortObject(obj) {
        let sorted = {};
        let keys = Object.keys(obj).sort();
        keys.forEach(key => { sorted[key] = obj[key]; });
        return sorted;
    }
    verifyReturn(vnp_Params) {
        return this.verifySignature(vnp_Params);
    }
    verifySignature(vnp_Params) {
        const secureHash = vnp_Params['vnp_SecureHash'];
        let vnp_Params_Fix = { ...vnp_Params };
        delete vnp_Params_Fix['vnp_SecureHash'];
        delete vnp_Params_Fix['vnp_SecureHashType'];

        vnp_Params_Fix = this.sortObject(vnp_Params_Fix);

        let signData = "";
        let isFirst = true;
        for (let key in vnp_Params_Fix) {
            if (vnp_Params_Fix.hasOwnProperty(key)) {
                let value = vnp_Params_Fix[key];
                let encodedKey = encodeURIComponent(key);
                let encodedValue = encodeURIComponent(value).replace(/%20/g, "+");

                if (isFirst) {
                    signData += encodedKey + "=" + encodedValue;
                    isFirst = false;
                } else {
                    signData += "&" + encodedKey + "=" + encodedValue;
                }
            }
        }

        const hmac = crypto.createHmac("sha512", this.secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        return secureHash === signed;
    }

}

module.exports = VnPayPaymentService;