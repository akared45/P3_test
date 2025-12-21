class VnPayIpnRequest {
    constructor(data) {
        this.vnp_TmnCode = data.vnp_TmnCode;
        this.vnp_Amount = Number(data.vnp_Amount);
        this.vnp_BankCode = data.vnp_BankCode;
        this.vnp_BankTranNo = data.vnp_BankTranNo;
        this.vnp_CardType = data.vnp_CardType;
        this.vnp_OrderInfo = data.vnp_OrderInfo;
        this.vnp_PayDate = data.vnp_PayDate;
        this.vnp_ResponseCode = data.vnp_ResponseCode; 
        this.vnp_TransactionNo = data.vnp_TransactionNo; 
        this.vnp_TransactionStatus = data.vnp_TransactionStatus;
        this.vnp_TxnRef = data.vnp_TxnRef; 
        this.vnp_SecureHash = data.vnp_SecureHash;
        this.allData = data;
    }
}

module.exports = VnPayIpnRequest;