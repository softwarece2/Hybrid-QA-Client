import { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { ChatSharp, ExpandMore, GetApp } from "@material-ui/icons";
import { CircularProgress, IconButton } from "@material-ui/core";
import moment from "moment";
import axiosInstance from "pages/Services/AxiosInstance";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

// Custom styles
export const Accordion = withStyles((theme) => ({
  root: {
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: "1px solid rgba(0, 0, 0, .125)",
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
      marginBottom: 8,
      borderBottom: "1px solid rgba(0, 0, 0, .125)",
    },
  },
  expanded: {},
}))(MuiAccordion);

export const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: "white",
    fontWeight: 500,
    paddingLeft: 0,
    minHeight: 40,
    "&$expanded": {
      minHeight: 48,
      color: "#1a1a1a",
      borderBottom: "1px solid rgba(0, 0, 0, .125)",
    },
  },
  content: {
    margin: "0px 0",
    "&$expanded": {
      margin: "8px 0",
    },
  },
  expandIcon: {
    padding: 4,
  },
  expanded: {},
}))(MuiAccordionSummary);

export const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: "#FAFAFA",
    color: "#666666",
    display: "block",
  },
}))(MuiAccordionDetails);

const InStageAccordions = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // ✨ Sort by createdDate ascending
  const sortedObservationFiles = [
    ...(data?.lineItemObservationFileDtos || []),
  ].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  const [downloading, setDownloading] = useState({
    loader: false,
    fileUrl: "",
  });

  async function handleFileDownload(fileUrl, fileName) {
    setDownloading({ loader: true, fileUrl });
    try {
      const { data } = await axiosInstance(fileUrl, { responseType: "blob" });
      saveAs(data, fileName);
    } catch (error) {
      toast.error("Failed to download file, please try after some time");
      console.log(error);
    } finally {
      setDownloading({ loader: false, fileUrl: "" });
    }
  }

  return sortedObservationFiles.map((item) => (
    <div key={item.id}>
      <Accordion
        expanded={expanded === item.id}
        onChange={handleChange(item.id)}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`panel${item.id}-content`}
          id={`panel${item.id}-header`}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <ChatSharp fontSize="small" color="primary" /> &nbsp;
            <Typography variant="body1">
              {item.createdByName} &nbsp;|&nbsp;{" "}
            </Typography>
            <Typography variant="caption">
              Submitted At:- &nbsp;
              <b>
                {item.createdDate
                  ? moment(item.createdDate).format("DD-MM-YYYY")
                  : "--"}
              </b>
            </Typography>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          {/* Remarks */}
          <div style={{ display: "flex" }}>
            <strong>Remarks:- &nbsp;</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: item.remarks || "No remarks available",
              }}
            />
          </div>
          <ul>
            {item.uploadedFiles?.length > 0 ? (
              item.uploadedFiles.map((fileUrl, index) => {
                const fileDetails =
                  item.lineItemObservationAttachmentDtos?.[index];
                const fileName = fileDetails?.fileName || `File_${index + 1}`;
                return (
                  <Typography
                    variant="caption"
                    color="secondary"
                    key={index}
                    component={"li"}
                  >
                    {fileName}
                    <IconButton
                      title="Download file"
                      disabled={downloading.fileUrl === fileUrl}
                      onClick={() => handleFileDownload(fileUrl, fileName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      {downloading.fileUrl === fileUrl && (
                        <CircularProgress size={16} />
                      )}
                      <GetApp fontSize="small" color="primary" />
                    </IconButton>
                  </Typography>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No files uploaded.
              </Typography>
            )}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  ));
};

export default InStageAccordions;
