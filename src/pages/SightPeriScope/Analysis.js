import axios from "axios";
import React, { useState } from "react";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import { FGK_HOST_URL } from "config.js";
import { toast } from "react-toastify";

export default function Analysis({ id }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ImageSrc, setImageSrc] = useState(null);
  const [isPass, setIsPass] = useState("N/A");
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e) => {
    setSelectedFile(e.target?.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setImageSrc(url);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    const getFileType = selectedFile.name.split(".").pop();
    const isValid = ["png", "jpg"].includes(getFileType);
    if (!isValid) {
      toast.error("Please upload .png and .jpg file.");
      return;
    }
    setIsPending(true);
    try {
      const req = new FormData();
      req.append("file", selectedFile);
      const { data } = await axios.post(FGK_HOST_URL + "predict", req);
      setIsPass(data.prediction);
    } catch (error) {
      console.log(error);
      toast.error("Failed to Read Image Please try again");
    } finally {
      setIsPending(false);
    }
  };

  if (id === 0 || id === 14) {
    return (
      <div style={{width:'100%', textAlign:'right'}}>
        <div
          style={{
            display:'inline-block',
            backgroundColor: isPass === "Non-Defected" ? "green" : isPass === "Defected" ? "red" : "grey",
            color: "white",
            textAlign: "center",
            margin: 0,
            width: 120,
            // float:'right'
          }}
        >
          {isPass}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "space-between", alignItems: "center" }}>
      <TextField type="file" onChange={handleChange} size="small" variant="standard" inputProps={{tabIndex:-1}} />

      {ImageSrc && <img src={ImageSrc} alt="uploaded" height={50} />}

      <Button tabIndex={-1} variant="outlined" size="small" color="secondary" onClick={handleAnalyzeImage} disabled={isPending}>
        {isPending && <CircularProgress size={24} />}Analyze
      </Button>

      <div
        style={{
          backgroundColor: isPass === "Non-Defected" ? "green" : isPass === "Defected" ? "red" : "grey",
          color: "white",
          textAlign: "center",
          margin: 0,
          width: 120,
          height: "100%",
        }}
      >
        {isPass}
      </div>
    </div>
  );
}
