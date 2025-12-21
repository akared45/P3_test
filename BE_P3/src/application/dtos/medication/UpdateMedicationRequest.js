class UpdateMedicationRequest {
    constructor(data) {
        if (data.name) this.name = data.name.trim();
        if (data.genericName) this.genericName = data.genericName.trim();
        if (data.drugClass) this.drugClass = data.drugClass;
        if (data.safety) this.safety = data.safety;
        if (data.usage) this.usage = data.usage;

        Object.freeze(this);
    }
}

module.exports = UpdateMedicationRequest;