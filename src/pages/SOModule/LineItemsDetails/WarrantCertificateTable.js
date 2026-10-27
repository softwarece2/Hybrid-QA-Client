import { useEffect, useState } from "react";
import "../../../App.css";
//component
import TableComponent from "components/table/index";
//material-ui
import { Typography } from "@material-ui/core";
//icons
import ActionButton from "components/ActionButton";

import { Dialog, DialogContent } from "@material-ui/core";
import moment from "moment/moment";
import { warrantDetails } from "pages/Services/URLs";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";
import QCCApprove from "./QCCApprove";
import { WarrentCertificate } from "./WarrentCertificate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/fontawesome-free-solid";


export default function WarrantCertificateTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [openApprove, setOpenApprove] = useState(false);


  const columns = [
    { title: "WT. No.", field: "categoryName", width: "auto" },
    {
      title: "Wt Issue Date",
      field: "wtIssueDate",
      width: "auto",
      render: (row) => (
        <Typography variant="subtitle2">{row.wtIssueDate ? moment(row.wtIssueDate).format("DD-MM-YYYY") : "-"}</Typography>
      ),
    },

    { title: "Wt Qty.", field: "qty", width: "auto" },
    {
      title: "Generate",
      render: (rowData) => {
        return (
          <ActionButton
            size="small"
            color="secondary"
            variant="outlined"
            onClick={() => {
              setOpenCertificate(true);
              setSelectedRow(rowData);
            }}
          >
            Generate

          </ActionButton>
        );
      },
    },
    {
      title: "Approve",
      field: "",
      render: (rowData) => {
        return (
          <ActionButton
            size="small"
            color="secondary"
            variant="outlined"
            onClick={() => {
              setOpenApprove(true);
              setSelectedRow(rowData);
            }}
          >
            Approve
          </ActionButton>
        );
      },
    },
    {
      title: "Actions",
      render: () => {
        return (
          // variant="contained"
          <ActionButton  color="secondary">
            <FontAwesomeIcon icon={faPrint} />
          </ActionButton>
        );
      },
    }
  ];
  async function fetchLI() {

    setLoading(true);
    try {
      const { data } = await axiosInstanceTran.get(warrantDetails);
      setRecords(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchLI();
  }, []);
  return (
    <>
      <Dialog maxWidth="lg" open={openCertificate} onClose={() => setOpenCertificate(false)}>
        <DialogContent>
          <WarrentCertificate onClose={() => setOpenCertificate(false)} selectedRow={selectedRow} />
        </DialogContent>
      </Dialog>

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        options={{ filtering: true, search: false }}
      />
      <QCCApprove
        open={openApprove}
        onClose={() => {
          setOpenApprove(false);
          //   fetchLI(supplyOrderId);
        }} //refresh & Fetch other LineItem Immediately after deletion
      // dataVal={dataVal}
      // fetchRecords={saleOrderId ? fetchLiBySale : () => fetchLI(supplyOrderId)}
      />
    </>
  );
}