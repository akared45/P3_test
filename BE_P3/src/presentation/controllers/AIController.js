class AIController {
    constructor({ suggestSpecialtyUseCase }) {
        this.suggestSpecialtyUseCase = suggestSpecialtyUseCase;
    }

    async consult(req, res, next) {
        try {
            const { symptoms } = req.body;

            const result = await this.suggestSpecialtyUseCase.execute({ symptoms });
            
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AIController;