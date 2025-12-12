class SpecializationController {
  constructor({
    getAllSpecializationsUseCase,
    createSpecializationUseCase,
    updateSpecializationUseCase,
    deleteSpecializationUseCase,
    getSpecializationDetailUseCase
  }) {
    this.getAllSpecializationsUseCase = getAllSpecializationsUseCase;
    this.createSpecializationUseCase = createSpecializationUseCase;
    this.updateSpecializationUseCase = updateSpecializationUseCase;
    this.deleteSpecializationUseCase = deleteSpecializationUseCase;
    this.getSpecializationDetailUseCase = getSpecializationDetailUseCase;
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.getAllSpecializationsUseCase.execute();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getDetail = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.getSpecializationDetailUseCase.execute(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const result = await this.createSpecializationUseCase.execute(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.updateSpecializationUseCase.execute({
        code: id,
        ...req.body
      });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.deleteSpecializationUseCase.execute(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = SpecializationController;