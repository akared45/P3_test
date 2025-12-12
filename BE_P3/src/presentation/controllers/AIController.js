class AIController {
  constructor({ suggestSpecialtyUseCase }) {
    this.suggestSpecialtyUseCase = suggestSpecialtyUseCase;
  }

  suggest = async (req, res, next) => {
    try {
      const { symptoms } = req.body;
      if (!symptoms) return res.status(400).json({ message: "Symptoms required" });

      const result = await this.suggestSpecialtyUseCase.execute(symptoms);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AIController;