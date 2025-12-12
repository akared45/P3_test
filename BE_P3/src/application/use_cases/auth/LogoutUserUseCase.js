class LogoutUserUseCase {
    constructor({ userSessionRepository }) {
        this.userSessionRepository = userSessionRepository;
    }

    async execute(refreshToken) {
        const session = await this.userSessionRepository.findByRefreshToken(refreshToken);
        if (!session) {
            return true;
        }
        if (!session.revoked) {
            const revokedSession = session.revoke();
            await this.userSessionRepository.save(revokedSession);
        }

        return true;
    }
}

module.exports = LogoutUserUseCase;