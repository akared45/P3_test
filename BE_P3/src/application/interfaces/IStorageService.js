const { NotImplementedException } = require('../../domain/exceptions');

class IStorageService {
    async upload(file) {
        throw new NotImplementedException('IStorageService.upload');
    }

    async delete(fileUrl) {
        throw new NotImplementedException('IStorageService.delete');
    }
}

module.exports = IStorageService;