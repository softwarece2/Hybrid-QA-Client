/* eslint-disable react-hooks/exhaustive-deps */
import { Chip, IconButton, makeStyles } from "@material-ui/core";
import {
  AttachFile,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
} from "@material-ui/icons";

import Button from "components/Button";

import { useRef, useState, useEffect } from "react";
import InStageAccordions from "./InStageAccordions";
import { toast } from "react-toastify";
import { getSalesgrpById } from "Redux/Actions/SupplyOrder/LIAction";
import { useSelector } from "react-redux";
import AutoCompleteNew from "components/AutoCompleteNew";
import { Controller, useForm } from "react-hook-form";
import axiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { lineItemObservationSave } from "pages/Services/URLs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  editorContainer: {
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#fafafa",
    borderRadius: 4,
    marginBottom: 8,
  },
  toolbar: {
    marginBottom: "10px",
    display: "flex",
    gap: "10px",
  },
  editor: {
    minHeight: "150px",
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#fff",
    outline: "none",
    borderRadius: "4px",
  },
}));

const schema = yup.object().shape({
  sendTo: yup.string().typeError("Required").required().nullable(),
});

// rename the component as per the use-case
const InStageForm = ({ data, selectedRow, recordlist }) => {
  const classes = useStyles();
  const editorRef = useRef(null);
  const fileRef = useRef(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);
  const [salesDetails, setSalesDetails] = useState([]);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loading, setLoading] = useState(false);

  const salesGrpId = useSelector((state) => state.loggedInUser?.salesGrpId);
  const empId = useSelector((state) => state.loggedInUser?.empId);

  const { control, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      inputRemarks: "",
      sendTo: null,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleCommand = (command) => {
    document.execCommand(command, false, null);
    switch (command) {
      case "bold":
        setIsBold((prev) => !prev);
        break;
      case "italic":
        setIsItalic((prev) => !prev);
        break;
      case "insertUnorderedList":
        setIsList((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const checkActiveStyles = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsList(document.queryCommandState("insertUnorderedList"));
  };

  useEffect(() => {
    const editor = editorRef.current;
    editor?.addEventListener("mouseup", checkActiveStyles);
    editor?.addEventListener("keyup", checkActiveStyles);
    checkActiveStyles();
    return () => {
      editor?.removeEventListener("mouseup", checkActiveStyles);
      editor?.removeEventListener("keyup", checkActiveStyles);
    };
  }, []);

  useEffect(() => {
    setIsList(false);
  }, []);

  const handleUploadImage = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFileToUpload((prev) => [...prev, ...files]);
  };

  // const [datareset, setDatareset] = useState({
  //   checkOffListMap: [],
  // });

  const handleDeleteFile = (name) => {
    const updatedFiles = selectedFileToUpload.filter(
      (file) => file.name !== name
    );
    setSelectedFileToUpload(updatedFiles);
  };

  const onFormSubmit = async () => {
    const plainText = editorRef.current?.innerText;

    if (!plainText.trim()) {
      toast.error("Please enter valid remarks");
      return;
    }

    const htmlText = `<div>${editorRef.current?.innerHTML}</div>`;

    try {
      setLoadingDraft(true);

      const formData = new FormData();

      const lineItemObservationDto = {
        id: selectedRow?.id || 0,
        supplyOrderId: selectedRow?.supplyOrderId,
        sendTo: getValues("sendTo"),
        createdBy: empId,
        inputRemarks: htmlText,
      };

      const checkOffListMainDto = {
        id: 0,
        createdBy: empId,
        checkOffListDtos: [],
      };

      let attachmentCounter = 0;
      // const uniqueFiles = new Set();
      let hasDuplicate = false;

      // data?.checkOffListMap?.forEach((item) => {
      //   item?.uploads?.forEach((file) => {
      //     if (uniqueFiles.has(file.name)) {
      //       hasDuplicate = true;
      //     } else {
      //       uniqueFiles.add(file.name);
      //     }
      //   });
      // });

      if (hasDuplicate) {
        toast.error(
          "Duplicate files found! Please rename or choose different files."
        );
        setLoadingDraft(false);
        return;
      }

      // Loop through checkOffListMap
      // data?.checkOffListMap?.forEach((item) => {
      //   const attachmentIds = [];

      //   // Loop through each uploaded file in checkOffListMap
      //   item?.uploads?.forEach(() => {
      //     attachmentCounter += 1;
      //     attachmentIds.push(attachmentCounter);
      //   });

      //   // Push the item to checkOffListDtos
      //   checkOffListMainDto.checkOffListDtos.push({
      //     id: 0,
      //     docName: item.docName,
      //     attachmentIds,
      //   });
      // });

      // Now, handle the files in `selectedFileToUpload`
      if (selectedFileToUpload && selectedFileToUpload.length > 0) {
        const attachmentIds = [];

        // Loop through selectedFileToUpload
        selectedFileToUpload.forEach(() => {
          attachmentCounter += 1;
          attachmentIds.push(attachmentCounter);
        });

        // Add another entry to the checkOffListDtos
        checkOffListMainDto.checkOffListDtos.push({
          id: 0,
          docName: "New Upload", // You can adjust the name here if you like
          attachmentIds,
        });
      }

      formData.append(
        "lineItemObservationDtoStr",
        JSON.stringify(lineItemObservationDto)
      );
      formData.append("checkOffListStr", JSON.stringify(checkOffListMainDto));

      attachmentCounter = 0;
      // data?.checkOffListMap?.forEach((item) => {
      //   item?.uploads?.forEach((file) => {
      //     attachmentCounter += 1;
      //     formData.append("checkofflist", file, file.name);
      //   });
      // });

      selectedFileToUpload.forEach((file) => {
        formData.append("checkofflist", file, file.name);
      });

      const response = await axiosInstanceTransaction.post(
        lineItemObservationSave,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data) {
        toast.success("Files and remarks submitted successfully");
        // setUploadedFileData(response?.data?.lineItemObservationFileDtos || []);
        console.log("Saved data:", response.data);
        setSelectedFileToUpload([]);
        setValue("sendTo", "");
        if (editorRef.current) editorRef.current.innerText = "";
        // setDatareset((prev) => ({
        //   ...prev,
        //   checkOffListMap: [],
        // }));
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoadingDraft(false);
    }
  };

  const fetchSalesGrpId = () => {
    setLoading(true);
    getSalesgrpById(salesGrpId)
      .then((data) => {
        setSalesDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales group:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSalesGrpId();
  }, []);

  return (
    <>
      <div className={classes.editorContainer}>
        <div className={classes.toolbar}>
          <IconButton
            size="small"
            variant={isBold ? "contained" : "outlined"}
            color={isBold ? "primary" : "default"}
            onClick={() => handleCommand("bold")}
          >
            <FormatBold fontSize="medium" />
          </IconButton>
          <IconButton
            size="small"
            variant={isItalic ? "contained" : "outlined"}
            color={isItalic ? "primary" : "default"}
            onClick={() => handleCommand("italic")}
          >
            <FormatItalic fontSize="medium" />
          </IconButton>
          <IconButton
            size="small"
            variant={isList ? "contained" : "outlined"}
            color={isList ? "primary" : "default"}
            onClick={() => handleCommand("insertUnorderedList")}
          >
            <FormatListBulleted fontSize="medium" />
          </IconButton>
        </div>
        <div
          name="inputRemarks"
          ref={editorRef}
          className={classes.editor}
          contentEditable
          suppressContentEditableWarning
          spellCheck
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "self-end",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ minWidth: 200 }}>
          <Controller
            name="sendTo"
            control={control}
            render={({
              field: { onChange, value, ...rest },
              fieldState: { error },
            }) => (
              <AutoCompleteNew
                {...rest}
                labelText="Send To"
                data={salesDetails}
                value={
                  salesDetails.find((item) => item.empId === value) || null
                }
                getOptionLabel={(option) => option?.username ?? ""}
                onChange={(e, selected) => onChange(selected?.empId ?? null)}
                isLoading={loading}
                fullWidth
                error={error}
                helperText={error?.message}
              />
            )}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-end",
            border: "1px solid lightgrey",
            padding: "4px 8px",
            flex: 1,
            backgroundColor: "#fafafa",
            borderRadius: 4,
          }}
        >
          <input
            type="file"
            multiple
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleUploadImage}
          />

          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AttachFile />}
            onClick={() => fileRef.current?.click()}
          >
            Attach Files
          </Button>

          {/* Selected Files Display */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {selectedFileToUpload.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                onDelete={() => handleDeleteFile(file.name)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <Button
          style={{ minWidth: 200 }}
          variant="contained"
          color="secondary"
          onClick={handleSubmit(onFormSubmit)}
          disabled={loadingDraft}
        >
          Send
        </Button>
      </div>

      <InStageAccordions data={recordlist} />
    </>
  );
};

export default InStageForm;
