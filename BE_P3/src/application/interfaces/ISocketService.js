const { NotImplementedException } = require('../../domain/exceptions');

class ISocketService {
    sendMessageToRoom(roomId, messageDto) {
        throw new NotImplementedException('ISocketService.sendMessageToRoom');
    }

    sendToUser(userId, eventName, data) {
        throw new NotImplementedException('ISocketService.sendToUser');
    }
}

module.exports = ISocketService;