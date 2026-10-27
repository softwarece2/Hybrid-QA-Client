import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@material-ui/core";

const files = [
  { fileName: 1, type: "xlsx" },
  { fileName: 2, type: "xlsx" },
  { fileName: 3, type: "xlsx" },
  { fileName: 4, type: "xlsx" },
  { fileName: 5, type: "xlsx" },
  { fileName: 6, type: "pdf" },
  { fileName: 7, type: "pdf" },
];

const FileSaverUI = () => {
  function handleDownload(file) {
    console.log("file downloaded");
    const type = file.fileName +'.' + file.type;
    // saveAs("URL", type );
  }

  return (
    <div>
      {files.map((file) => (
        <Button variant="contained"  onClick={() => handleDownload(file)}>{file.fileName} Download</Button>
      ))}
    </div>
  );
};

export default FileSaverUI;
