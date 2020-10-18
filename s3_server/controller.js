var aws = require("aws-sdk");
require("dotenv").config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: "ap-south-1", // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  sslEnabled: false,
});
const s3 = new aws.S3(); // Create a new instance of S3
const S3_BUCKET = process.env.Bucket;
// Now lets export this function so we can call it from somewhere else
exports.putImg = (req, res) => {
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  // Set up the payload of what we are sending to the S3 api
  console.log("fileType", fileType);
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${fileName}.${fileType}`,
    Expires: 500,
    ContentType: fileType,
    ACL: "public-read",
  };
  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    console.log(data);
    if (err) {
      console.log(err);
      res.json({ success: false, error: err });
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}.${fileType}`,
    };
    // Send it all back
    res.json({ success: true, data: { returnData } });
  });
};

exports.deleteImg = (req, res) => {
  console.log("key to delete is____", req.body.key);
  const fileName = req.body.key;

  /* The following example deletes an object from an S3 bucket. */

  var params = {
    Bucket: S3_BUCKET,
    Key: fileName,
  };
  s3.deleteObject(params, function (err, data) {
    if (err) {
      // an error occurred
      console.error(err, err.stack);
      res.json({ message: "not deleted" });
    } else {
      console.log(data); // successful response
      res.json({ message: "deleted" });
    }

    /*
   data = {
   }
   */
  });
  // s3.getSignedUrl("deleteObject", s3Params, (err, data) => {
  //   if (err) {
  //     console.log("There was an error deleting your photo: ", err);
  //     res.json({ success: false, error: err });
  //   }

  //   // Send it all back
  //   res.json({ success: true, data: data });
  // });
};
