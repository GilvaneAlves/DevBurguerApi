const multer = require("multer");
const { resolve } = require("node:path");
const { v4 } = require("uuid");

module.exports = {
    Storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", "uploads"),

        filename: (request, file, callback) => {
            const uniqueName = `${v4()}-${file.originalname}`;
            return callback(null, uniqueName);
        }
    }),
};