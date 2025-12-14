const GetNotificationsRequest = require('../../application/dtos/notification/GetNotificationsRequest');
const MarkNotificationReadRequest = require('../../application/dtos/notification/MarkNotificationReadRequest');

class NotificationController {
    constructor({ getNotificationsUseCase, markNotificationAsReadUseCase }) {
        this.getNotificationsUseCase = getNotificationsUseCase;
        this.markNotificationAsReadUseCase = markNotificationAsReadUseCase;
    }

    async getNotifications(req, res, next) {
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

    async markAsRead(req, res, next) {
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
}

module.exports = NotificationController;