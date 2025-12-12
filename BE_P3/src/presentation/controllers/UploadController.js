class UploadController {
    constructor({ storageService }) {
        this.storageService = storageService;
    }

    uploadImage = async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const url = await this.storageService.upload(req.file);
            return res.status(200).json({
                message: "Upload successful",
                url: url
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = UploadController;