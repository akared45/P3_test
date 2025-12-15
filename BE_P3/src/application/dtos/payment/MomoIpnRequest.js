class MomoIpnRequest {
    constructor(data) {
        this.partnerCode = data.partnerCode;
        this.orderId = data.orderId;
        this.requestId = data.requestId;
        this.amount = Number(data.amount);
        this.orderInfo = data.orderInfo;
        this.orderType = data.orderType;
        this.transId = data.transId;
        this.resultCode = Number(data.resultCode);
        this.message = data.message;
        this.payType = data.payType;
        this.responseTime = data.responseTime;
        this.extraData = data.extraData;
        this.signature = data.signature;
    }
}

module.exports = MomoIpnRequest;