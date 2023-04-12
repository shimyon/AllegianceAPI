const util = require("util");
const multer = require("multer");
const path = require("path");
const maxSize = 2 * 1024 * 1024;
const date = require('date-and-time')

let fileName = "";

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.env.UPLOAD_FOLDER, "uploads"));
        console.log(path.join(process.env.UPLOAD_FOLDER, "uploads"));
    },
    filename: (req, file, cb) => {
        const now = new Date();
        const newDateValue = date.format(now, 'YYYY_MM_DD_HH_mm_ss');
        var ext = file.originalname.split(".")
        fileName = ext[0] + "_" + newDateValue + "." + ext[ext.length - 1];
        cb(null, fileName);
        process.env.UPLOADFILE = process.env.UPLOADFILE + "," + fileName;
        console.log(fileName);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).any();

// create the exported middleware object
let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;