class ChatController {
    constructor({ getChatHistoryUseCase }) {
        this.getChatHistoryUseCase = getChatHistoryUseCase;
    }

    async getHistory(req, res, next) {
        try {
            const { appointmentId } = req.params;
            const messages = await this.getChatHistoryUseCase.execute(appointmentId);
            return res.status(200).json({ data: messages });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ChatController;