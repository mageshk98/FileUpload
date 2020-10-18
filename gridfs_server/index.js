try {
  var express = require("express");
  var bodyParser = require("body-parser");
  var cors = require("cors");
  var path = require("path");
  require("dotenv").config();
} catch (error) {
  console.error("ERROR are all the Dependencies installed?");
  console.log(error);
  process.exit(1);
}

// Config
var port = process.env.PORT || 3002;

var app = express(); // Define our app
const controller = require("./controller");
app.use(cors());
// Configure app to use bodyParser()
// This will let us get data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  return res.sendFile(path.join(`${__dirname}/index.html`));
});
app.post("/upload", controller.uploadSingleFile);
app.post("/uploadMultiple", controller.uploadMultiple);
app.post("/test", controller.tester);
app.listen(port);

console.log("Server Started make a request to localhost:" + port);
