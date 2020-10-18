import React, { Component, useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [upload, setUpload] = useState({
    success: false,
    url: "",
    uploadedLocations: [],
  });
  const [filename, setFilename] = useState("");
  const uploadInput = useRef();
  const handleChange = (ev) => {
    setUpload({ success: false, url: "", uploadedLocations: [] });
  };
  // Perform the upload
  const uploadToServer = (file, fileName, fileType) => {
    axios
      .post("http://192.168.43.240:3001/sign_s3", {
        fileName: fileName,
        fileType: fileType,
      })
      .then((response) => {
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        // console.log("url log---", url);
        let locations = [...upload.uploadedLocations];
        locations.push(url);
        let x = { ...upload, url: url, uploadedLocations: locations };
        console.log("resut is__", x);
        setUpload(x);
        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            "Content-Type": fileType,
          },
        };
        axios
          .put(signedRequest, file, options)
          .then((result) => {
            console.log("Response from s3");
            setUpload({ ...upload, url: url, success: true });
          })
          .catch((error) => {
            alert("ERROR " + JSON.stringify(error));
          });
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };

  const handleUpload = async () => {
    let _uploadFiles = uploadInput.current.files;

    if (_uploadFiles.length > 0) {
      for (let x = 0; x < _uploadFiles.length; x++) {
        let file = _uploadFiles[x];
        let fileParts = file.name.split(".");
        let fileName = fileParts[0];
        let fileType = fileParts[1];
        console.log("Preparing the upload");
        setFilename(`${fileName}.${fileType}`);
        uploadToServer(file, fileName, fileType);
      }
    }
  };
  const deleteImg = () => {
    axios
      .post("http://192.168.43.240:3001/delete", {
        key: filename,
      })
      .then((response) => {
        console.log("delete response", response);
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };
  const Success_message = () => (
    <div style={{ padding: 10 }}>
      <h3 style={{ color: "green" }}>Uploaded !!</h3>

      <br />
    </div>
  );
  console.log("upload data", upload);
  return (
    <div className="App">
      <h1>AWS s3 upload</h1>
      {upload.success ? <Success_message /> : null}
      {upload.success && upload.uploadedLocations.length > 0
        ? upload.uploadedLocations.map((loc) => (
            <a href={loc}>{loc.toString()}</a>
          ))
        : null}
      <input onChange={handleChange} ref={uploadInput} type="file" multiple />
      <br />
      {upload.url !== "" && (
        <a href={upload.url} target="__blank">
          {upload.url}
        </a>
      )}

      <div style={{ display: "flex" }}>
        <button
          onClick={handleUpload}
          style={{ padding: "7px", margin: "0px 5px" }}
        >
          UPLOAD
        </button>
        <button
          onClick={deleteImg}
          style={{ padding: "7px", margin: "0px 5px" }}
        >
          delete
        </button>
      </div>
    </div>
  );
}

export default App;
