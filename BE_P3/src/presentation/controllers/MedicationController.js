const CreateMedicationRequest = require('../../application/dtos/medication/CreateMedicationRequest');
const UpdateMedicationRequest = require('../../application/dtos/medication/UpdateMedicationRequest');

class MedicationController {
    constructor({
        getMedicationCatalogUseCase,
        addPrescriptionUseCase,
        createMedicationUseCase,
        updateMedicationUseCase,
        deleteMedicationUseCase
    }) {
        this.getMedicationCatalogUseCase = getMedicationCatalogUseCase;
        this.addPrescriptionUseCase = addPrescriptionUseCase;
        this.createMedicationUseCase = createMedicationUseCase;
        this.updateMedicationUseCase = updateMedicationUseCase;
        this.deleteMedicationUseCase = deleteMedicationUseCase;
    }

    getMedications = async (req, res, next) => {
        try {
            const filters = req.query;
            const medications = await this.getMedicationCatalogUseCase.execute(filters);
            res.status(200).json({ status: 'success', data: medications });
        } catch (error) { next(error); }
    };

    createMedication = async (req, res, next) => {
        try {
            const medicationDto = new CreateMedicationRequest(req.body);
            const result = await this.createMedicationUseCase.execute(req.user, medicationDto);
            res.status(201).json({ status: 'success', data: result });
        } catch (error) { next(error); }
    };

    updateMedication = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateDto = new UpdateMedicationRequest(req.body);
            const result = await this.updateMedicationUseCase.execute(req.user, id, updateDto);
            res.status(200).json({ status: 'success', data: result });
        } catch (error) { next(error); }
    };

    deleteMedication = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.deleteMedicationUseCase.execute(req.user, id);
            res.status(200).json({ status: 'success', message: result.message });
        } catch (error) { next(error); }
    };

    addPrescription = async (req, res, next) => {
        try {
            const { appointmentId } = req.params;
            const request = { ...req.body, appointmentId };
            const result = await this.addPrescriptionUseCase.execute(request);
            res.status(201).json({ status: 'success', message: "Prescription created successfully" });
        } catch (error) { next(error); }
    };
}

module.exports = MedicationController;