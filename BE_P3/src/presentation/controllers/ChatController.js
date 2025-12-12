class ChatController {
    constructor({ sendMessageUseCase, getChatHistoryUseCase }) {
        this.sendMessageUseCase = sendMessageUseCase;
        this.getChatHistoryUseCase = getChatHistoryUseCase;
    }

    getHistory = async (req, res, next) => {
        try {
            const { appointmentId } = req.params;
            const { limit, offset } = req.query;

            const messages = await this.getChatHistoryUseCase.execute({
                appointmentId,
                limit: parseInt(limit) || 50,
                offset: parseInt(offset) || 0
            });

            return res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    };

    sendMessage = async (req, res, next) => {
        try {
            const senderId = req.user.id;

            const { appointmentId, content, type, fileUrl } = req.body;

            const result = await this.sendMessageUseCase.execute({
                senderId,
                appointmentId,
                content,
                type,
                fileUrl
            });

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ChatController;