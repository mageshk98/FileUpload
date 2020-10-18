const upload = require("./DAO");

const tester = (req, res) => {
  console.log(req.body.name);
  res.send({ result: `received,${req.body.name}` });
};

const uploadMultiple = async (req, res) => {
  try {
    await upload.uploadFilesMiddleware(req, res);
    console.log(req.files);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }

    return res.send(`Files have been uploaded.`);
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

const uploadSingleFile = async (req, res) => {
  try {
    console.log(req.body);
    await upload.uploadFileMiddleware(req, res);
    if (req.body.file === undefined) {
      return res.send(`You must select a file.`);
    }

    return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultiple,
  tester,
};
