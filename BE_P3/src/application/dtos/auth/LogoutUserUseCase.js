class LogoutUserUseCase {
    constructor({ userSessionRepository }) {
        this.userSessionRepository = userSessionRepository;
    }

    async execute(refreshToken) {
        if (refreshToken) {
            await this.userSessionRepository.deleteByRefreshToken(refreshToken);
        }
        return true;
    }
}

module.exports = LogoutUserUseCase;