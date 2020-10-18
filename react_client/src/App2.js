import React, { useState } from "react";
import "./App.css";
function App() {
  const [upload, setUpload] = useState({
    success: false,
    url: "",
    filesdata: [],
  });
  const [response, setResponse] = useState("");
  const handleChange = (ev) => {
    setUpload({ success: false, url: "", filesdata: ev.target.files });
  };
  // Perform the upload
  const uploadToServer = async (e) => {
    e.preventDefault();

    console.log("file___", upload.filesdata);
    let formData = new FormData();

    // formData.append("files", _uploadFiles[0]);
    formData.append("files", upload.filesdata);

    // fetch("http://192.168.43.240:3002/upload", {
    await fetch("http://192.168.43.240:3002/uploadMultiple", {
      // await fetch("http://192.168.43.240:3002/test", {
      method: "POST",
      body: formData,
      // body: JSON.stringify({ name: "Magesh" }),
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // headers: {
      //   "content-type": "multipart/form-data",
      // },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResponse(JSON.stringify(data));
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };

  const reset = () => {
    setUpload({ filesdata: [], success: false, url: "" });
  };
  return (
    <div className="App">
      <form onSubmit={uploadToServer}>
        <h1>MongoDB GRIDFS</h1>
        <div className="form-group">
          <input
            type="file"
            name="multi-files"
            multiple
            id="input-files"
            className="form-control-file border"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
