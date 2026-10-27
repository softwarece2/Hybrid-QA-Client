import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import { useCenteredTree } from "./Helper";
//
import "./style.css";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { Dialog, LinearProgress, Typography } from "@material-ui/core";
import { DialogContent, DialogTitle } from "Utils";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "components/table/index";
import { Grid, makeStyles } from "@material-ui/core";

const nodeSize = { x: 200, y: 100 };
const url = "supplyOrder/getOverallTreeView/";
const getBySaleOrderIdUrl = "soLineItem/getBySaleOrderId/";

export function PaperComponent({ id, ...props }) {
  console.log(id, props, "idprops");
  return (
    <Draggable handle={"#" + id} cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const containerStyles = {
  height: "800px",
  background: "#f9f9f9",
};

function ItemDetails({ onClose, lineItem }) {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [columns] = useState([
    {
      title: "Work Order No.",
      field: "saleOrderNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Line Item/ Indent Sl No.",
      field: "lineItemNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Material No./EP Code No.",
      field: "partNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Material Description",
      field: "description",
      width: "auto",
      sorting: true,
    },
    { title: "UoM", field: "uomName", width: "auto" },
    { title: "Unit Price", field: "unitCostStr", width: "auto" },
    { title: "Item Category", field: "itemCategoryName", width: "auto" },
    { title: "Total Qty", field: "orderQty", width: "auto" },
    { title: "Remaining Qty", field: "remainingQty", width: "auto" },
    { title: "Is Imported", field: "imported", width: "auto" },
    // { title: "Acct", field: "account", width: "auto" },
    // {
    //   title: "Under Warranty/Guarantee",
    //   field: "underWarrantyStr",
    //   width: "auto",
    // },
    // { title: "Warranty Duration", field: "warrantyStr", width: "auto" },
    // {
    //   title: "Warranty in Years/Months/Days",
    //   field: "durationTypeName",
    //   width: "auto",
    // },
    // { title: "GCS", field: "gcs", width: "auto" },
    // { title: "GEM", field: "gem", width: "auto" },
    // { title: "Self Certification", field: "selfCertification", width: "auto" },
    // { title: "Status", field: "status", width: "auto", filtering: false },
    // { title: "Actions", field: "actions", width: "auto", filtering: false },
  ]);

  // console.log(lineItem);

  useEffect(() => {
    if (lineItem) {
      setLoading(true);
      axiosInstance
        .get(getBySaleOrderIdUrl + lineItem.id)
        .then(({ data }) => {
          console.log(data);
          if (Array.isArray(data)) {
            setRecords(
              data.map((el, i) => ({
                ...el,
                imported: el?.imported ? "Yes" : "No",
              }))
            );
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [lineItem]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={true}
      PaperComponent={(props) => (
        <PaperComponent id="draggable-dialog-title" {...props} />
      )}
      aria-labelledby="draggable-dialog-title">
      <DialogTitle
        onClose={onClose}
        style={{ cursor: "move" }}
        id="draggable-dialog-title">
        Line-Item-Details
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        {/* <Typography color="error" variant="caption">
          {JSON.stringify(records)}
        </Typography> */}
        <TableComponent
          isLoading={loading}
          data={records}
          columns={columns}
          title=""
        />
      </DialogContent>
    </Dialog>
  );
}

const DThreeTree = ({ onClose, soObj }) => {
  const separation = { siblings: 2, nonSiblings: 0.8 };
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  // const [translate, containerRef] = useCenteredTree();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [openItemDetails, setOpenItemDetails] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState();

  useEffect(() => {
    if (soObj?.id) {
      setLoading(true);
      axiosInstance
        .get(url + soObj.id)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            setRecords(data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading(false));
    }
  }, [soObj?.id]);


  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current?.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 50 });
    }
  }, [containerRef,loading]);
  


  return (
    <>
      {openItemDetails && (
        <ItemDetails
          onClose={() => setOpenItemDetails(false)}
          lineItem={selectedLineItem}
        />
      )}
      <Dialog
        open={true}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title555" {...props} />
        )}>
        <DialogTitle
          onClose={onClose}
          style={{ cursor: "move" }}
          id="draggable-dialog-title555">
          Supply Order Details Tree View
        </DialogTitle>
        <DialogContent style={containerStyles} ref={containerRef}>
          {loading ? (
            <LinearProgress />
          ) : (
            <Tree
              data={records}
              nodeSize={nodeSize}
              separation={separation}
              transitionDuration={1000}
              orientation="vertical"
              translate={translate}
              onNodeClick={(nodeData, evtData) => {
                if (!Array.isArray(nodeData.data.children)) {
                  setOpenItemDetails(true);
                  setSelectedLineItem(nodeData.data);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DThreeTree;
