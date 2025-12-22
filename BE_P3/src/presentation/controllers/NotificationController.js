const GetNotificationsRequest = require('../../application/dtos/notification/GetNotificationsRequest');
const MarkNotificationReadRequest = require('../../application/dtos/notification/MarkNotificationReadRequest');

class NotificationController {
    constructor({ getNotificationsUseCase, markNotificationAsReadUseCase, deleteNotificationUseCase }) {
        this.getNotificationsUseCase = getNotificationsUseCase;
        this.markNotificationAsReadUseCase = markNotificationAsReadUseCase;
        this.deleteNotificationUseCase = deleteNotificationUseCase;
    }

    getNotifications = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { limit, offset } = req.query;

            const requestDto = new GetNotificationsRequest({
                userId,
                limit,
                offset
            });

            const result = await this.getNotificationsUseCase.execute(requestDto);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    markAsRead = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const notificationId = req.params.id;

            const requestDto = new MarkNotificationReadRequest({
                userId,
                notificationId
            });

            const result = await this.markNotificationAsReadUseCase.execute(requestDto);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.id || req.user._id;

            await this.deleteNotificationUseCase.execute({
                notificationId: id,
                userId: userId
            });

            return res.status(200).json({ message: "Delete success" });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = NotificationController;