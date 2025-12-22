class ChatController {
    constructor({ getChatHistoryUseCase }) {
        this.getChatHistoryUseCase = getChatHistoryUseCase;
    }

    getHistory = async (req, res, next) => {
        try {
            const { appointmentId } = req.params;
            const userId = req.user.id;

            const messages = await this.getChatHistoryUseCase.execute(appointmentId, userId);

            res.json({ success: true, data: messages });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ChatController;