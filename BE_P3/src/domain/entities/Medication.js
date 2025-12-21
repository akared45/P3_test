class Medication {
    constructor({ id, code, name, genericName, drugClass, safety, usage, isDeleted }) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.genericName = genericName;
        this.drugClass = drugClass;
        this.safety = safety;
        this.usage = usage;
        this.isDeleted = isDeleted || false;
    }
}

module.exports = Medication;