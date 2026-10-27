import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@material-ui/core";
import { FilterList, Restore } from "@material-ui/icons";
import moment from "moment";

import { toast } from "react-toastify";
import TableComponent from "components/table";
import CustomizedInputs from "components/TextField";
import { VideoPlayer } from "pages/SOModule/OL/Edit";
import { RegistrationStatusChips } from "pages/SOModule/OL/OLViewLI";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import NewOLAllotTests from "pages/Testt/TestReport";
import { REGISTRATION_NUMBER_STATUS } from "Globals.js";
import DraggableCompose from "widget/dragablePopper";
import VideoInspection from "video/cv2";

const columns = [
  { title: "Register No.", field: "registerNo", render: (r) => <b>{r.registerNo} </b> },
  { title: "Product Name", field: "productName" },
  { title: "Ol Number", field: "olNumber" },
  { title: "Line Item", field: "soLineItemNo" },
  {
    title: "Allotted DateTime",
    field: "olLineItemDate",
    render: (r) => <span style={{ fontFamily: "monospace" }}>{r.olLineItemDate} </span>,
  },
  { title: "Device Status", field: "status", render: (r) => <RegistrationStatusChips status={r.status} /> },
];
const now = new Date();
const past3MonthDate = new Date().setMonth(now.getMonth() - 3);

const defaultValues = {
  fromDate: "",
  toDate: "",
  productId: "",
  status: "",
};

export default function ExaminerAllotedTest() {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const dispatch = useDispatch();

  const [openSavedVideo, setOpenVidePlayer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openTest, setOpenTest] = useState(false);
  const [records, setRecords] = useState([]);

  const [products, setProducts] = useState([]);
  const [regStatus, setRegStatus] = useState([]);

  const orgId = loggedInUser?.orgId;
  const empId = loggedInUser?.empId;

  const { reset, control, getValues } = useForm({
    defaultValues,
  });

  const getTests = useCallback(
    async (fromDate, toDate, productId, status) => {
      setLoading(true);
      try {
        const params = {
          fromDate: fromDate ? moment(fromDate).format("DD-MM-YYYY") : undefined,
          toDate: toDate ? moment(toDate).format("DD-MM-YYYY") : undefined,
          productId: productId || undefined,
          status: status || undefined,
        };
        const { data } = await axiosInstanceT(`offerLetter/getAllottedOfferLettersByStatusForFirmTest/${orgId}/${empId}`, {
          params,
        });

        setRecords(
          data.sort((a, b) => {
            const inProgress = REGISTRATION_NUMBER_STATUS.INPROCESS;
            return (a.status === inProgress ? -1 : 1) - (b.status === inProgress ? -1 : 1);
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [empId, orgId]
  );

  useEffect(() => {
    const fromDate = moment(past3MonthDate).format("YYYY-MM-DD");
    const toDate = moment(now).format("YYYY-MM-DD");
    getTests(fromDate, toDate);
    axiosInstanceAte("/products/")
      .then(({ data }) => {
        setProducts(data);
      })
      .catch(console.log);
    axiosInstanceAte("/products/getStatus")
      .then(({ data }) => {
        setRegStatus(data);
      })
      .catch(console.log);
  }, [getTests]);

  const actions = [
    {
      icon: () => (
        <Button style={{ textTransform: "capitalize" }} size="small" variant="contained" color="primary">
          Test
        </Button>
      ),
      onClick: (_, rowData) => {
        if (!rowData.productId) {
          toast.info("Product Id not mapped with line item: " + rowData.soLineItemNo);
          return;
        }
        setOpenTest(true);
        setSelectedRow(rowData);
      },
    },
    {
      icon: () => (
        <Button style={{ textTransform: "capitalize", minWidth: 90 }} size="small" variant="outlined" color="secondary">
          Video Cam
        </Button>
      ),
      onClick: (_, rowData) => {
           setSelectedRow(rowData);
           setOpenCam(true)
      },
    },
    {
      icon: () => (
        <Button style={{ textTransform: "capitalize", minWidth: 100 }} size="small" variant="outlined" color="secondary">
          Saved Videos
        </Button>
      ),
      onClick: (_, rowData) => {
        setOpenVidePlayer(true);
        setSelectedRow(rowData);
      },
    },
  ];

  async function handleFilter(isReset) {
    try {
      if (isReset) {
        reset();
        getTests();

        return;
      }

      const { fromDate, toDate, productId, status } = getValues();
      if (fromDate && !toDate) {
        toast.info("Please enter 'To date'");
        return;
      }

      if (toDate && !fromDate) {
        toast.info("Please enter 'From date'");
        return;
      }

      if (toDate && fromDate && new Date(toDate).getTime() < new Date(fromDate).getTime()) {
        toast.info("'To Date' should be greater than from date 'From date'");
        return;
      }
      getTests(fromDate, toDate, productId, status);
    } catch (error) {
      console.log(error);
    }
  }

  const Filter = (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
      <Controller
        name="fromDate"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            label="From Date"
            InputLabelProps={{ shrink: true }}
            placeholder="From date"
            onChange={onChange}
            variant="outlined"
            format="dd/MM/yyyy"
            value={moment(value).format("YYYY-MM-DD")}
            type="date"
            size="small"
          />
        )}
      />

      <Controller
        name="toDate"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            label="To Date"
            placeholder="From date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            onChange={onChange}
            value={moment(value).format("YYYY-MM-DD")}
            type="date"
            size="small"
          />
        )}
      />

      <Controller
        control={control}
        name="productId"
        render={({ field: { onChange, value } }) => (
          <CustomizedInputs
            select
            style={{ minWidth: 200 }}
            label="Product"
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            fullWidth
            onChange={onChange}
            value={value}
          >
            <option value="">Select Product</option>
            {products?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.prodName}
              </option>
            ))}
          </CustomizedInputs>
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <CustomizedInputs
            select
            label="Status"
            InputLabelProps={{ shrink: true }}
            style={{ minWidth: 200 }}
            SelectProps={{ native: true }}
            fullWidth
            onChange={onChange}
            value={value}
          >
            <option value="">Select Test</option>
            {regStatus.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </CustomizedInputs>
        )}
      />
      <Button
        startIcon={<FilterList />}
        onClick={() => handleFilter()}
        style={{ textTransform: "capitalize" }}
        size="small"
        variant="contained"
        color="primary"
      >
        Filter
      </Button>
      <Button
        startIcon={<Restore />}
        onClick={() => handleFilter(true)}
        style={{ textTransform: "capitalize" }}
        size="small"
        variant="outlined"
      >
        Reset
      </Button>
    </div>
  );
const [openCam, setOpenCam] = useState(false);
  return (
    <>
      {openSavedVideo && (
        <VideoPlayer onClose={() => setOpenVidePlayer(false)} loggedInUser={loggedInUser} olNumber={selectedRow.olNumber} />
      )}

      {openCam && (<DraggableCompose initialPosition={{x:0, y:0}} onClose={() =>setOpenCam(false)}> 
        <VideoInspection olNumber={selectedRow?.olNumber} lineItemNo={selectedRow?.soLineItemNo}/>
      </DraggableCompose>)}

      {openTest && (
        <NewOLAllotTests
          open={openTest}
          setOpen={setOpenTest}
          regNo={{ id: selectedRow.registerNoId, registerNo: selectedRow.registerNo }}
          ol={{ ...selectedRow, id: selectedRow.olLineItemId }}
        />
      )}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        pageSize={15}
        title={Filter}
        actions={actions}
        options={{ filtering: false }}
      />
    </>
  );
}
