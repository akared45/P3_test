const fs = require('fs');
const path = require('path');
const IStorageService = require('../../application/interfaces/IStorageService');
class LocalDiskStorageService extends IStorageService {
    async upload(file) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = `file-${uniqueSuffix}${extension}`;
        const uploadDir = path.join(__dirname, '../../../public/uploads');
        const filePath = path.join(uploadDir, filename);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        await fs.promises.writeFile(filePath, file.buffer);
        return `/uploads/${filename}`;
    }

    async delete(fileUrl) {
        try {
            if (!fileUrl) return;
            const fileName = fileUrl.split('/uploads/')[1];
            if (!fileName) return;
            const filePath = path.join(__dirname, '../../../public/uploads', fileName);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (err) {
            console.error("Delete file error:", err);
        }
    }
}

module.exports = LocalDiskStorageService;