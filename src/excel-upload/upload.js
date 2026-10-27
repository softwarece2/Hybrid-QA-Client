import React, { useState, useRef } from "react";
import {
  // LinearProgress,
  Button,
  Box,
  // Typography,
  TextField,
} from "@material-ui/core";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { ORG_TYPE } from "Globals.js";
import { useSelector} from "react-redux";
const ExcelUpload = ({
  selectedUploadRow,
  getRecord,
  rowData,
  selectedTab,
  isHotTest,
  accept,
  productId,
  testId,
  devId,
  ol,
  records,
  regNo,
  roundTest,
  onSubmit
}) => {
  const [loading, setLoading] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const hasAccessToAdd = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;
  const fileInputRef = useRef(null);
  const resetUploadState = () => {
    // setProgress(0);
    getRecord();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];

    if (!file) {
      toast.info("Please select file.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    let url;

    url = "iol/uploadIolColdTest";
    formData.append("id", roundTest?.id);
    formData.append("IolAteTestfilename", file.name);
    formData.append("IolAteTestfile", file);
    formData.append("productTypeId", 1); // for TkDP productType ID is 1
    // formData.append("")
    // TODO:--- remove static ID
    formData.append("approvedById", "");
    formData.append("productId", productId);
    formData.append("testId", testId);
    formData.append("devId", devId);
    formData.append(hasAccessToAdd ? 'olLineItemId' : 'subSlipLineItemId', ol.id);
    formData.append("testType", selectedTab);
    formData.append("hotCold", isHotTest ? 0 : 1);

    try {
      await axiosInstanceIol.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 2XX
      toast.success("File uploaded successfully");
      onSubmit(true);
      resetUploadState();
    } catch (error) {
      // setProgress(0);
      toast.error(error?.response?.data || "Failed to upload file");
      onSubmit(false);
    }
    setLoading(false);
  };
  return (
    <Box display="flex" my={1}>
      <TextField
        size="small"
        variant="outlined"
        type="file"
        inputRef={fileInputRef}
        inputProps={{
          accept: accept || ".xlsx,.xls",
        }}
      />
      <Button disabled={loading} variant="contained" color="primary" onClick={handleUpload} style={{ marginLeft: 8 }}>
        Upload
      </Button>
      {/* {progress > 0 && (
          <Box style={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="textSecondary" align="center">
              {progress}%
            </Typography>
          </Box>
        )} */}
    </Box>
  );
};

export default ExcelUpload;
