const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

// Connect to the db

var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/ats_attachments",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  cache: true,
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }

    var filename = `${Date.now()}-ats-${file.originalname}`;
    callback(null, filename);
  },
});
//single upload
var uploadFile = multer({ storage: storage }).single("files");
var uploadFileMiddleware = util.promisify(uploadFile);

//upload multiple files

var uploadMultipleFiles = multer({
  storage: storage,
}).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadMultipleFiles);

module.exports = { uploadFileMiddleware, uploadFilesMiddleware };
