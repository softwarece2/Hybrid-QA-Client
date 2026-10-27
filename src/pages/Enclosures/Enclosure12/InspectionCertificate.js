/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { Box, Button, Checkbox, CircularProgress, FormControl, InputLabel, LinearProgress, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import converter from "number-to-words";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { saveAs } from "file-saver";
import { PDF_SERVER } from "config";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceMaster from "pages/Services/AxiosInstance";
import { activeSignatoryList, saveINoteUrl } from "pages/Services/URLs";
import { CheckBox, CheckBoxOutlineBlank, Print, SendOutlined } from "@material-ui/icons";
import moment from "moment";
import CustomizedInputs from "components/TextField";
import { Autocomplete } from "@material-ui/lab";
import AutoCompleteNew from "components/AutoCompleteNew";
import ExternalInoteGeneration from "pages/InspectorModule/INote/ExternalInoteGeneration";
import CQAEDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

function generatePDF(details,selectedPrintOption) {

  axios({
    method: "post",
    url: PDF_SERVER + "i-note",
    data: { details, selectedPrintOption },
    responseType: "blob",
  })
    .then(({ data }) => {
      const pdfBlob = new Blob([data], { type: "application/pdf" });
      saveAs(pdfBlob, `i-note_${details.inoteNo}_${moment().format("YYYY-MM-DD")}.pdf`);
    })
    .catch((error) => {
      toast.error("Failed to get i-note pdf, please try again later");
      console.error("Error generating PDF:", error);
    });
}

const defaultValues = {
  supplyOrderNo: "",
  supplyOrderDate: "",
  lineItemNo: "",
  contractorName: "",
  contractorAddress: "",
  indentor: "",
  orderTypeNo: "",
  orderTypeDate: "",
  consignee: "",
  inspectionStart: "",
  inspectionEnd: "",
  offerLetterNo: "",
  offerLetterDate: "",
  remarks: "",
  inoteTypeId: 3,
  createdDate: "",
  inoteDate: "",
  inoteId: "",
  penaltyLetterNo: "",
  inoteTypeName: "",
  orderedQty: "",
  inoteNo: "",
  selectedSignatory: "",
  selectedSignatoryObj: null,
  inoteLineItems: [
    {
      partNo: "",
      description: "",
      uom: "",
      tendered: "",
      accepted: "",
      rejected: "",
      ledgerFolio: "",
      regNos: [],
      failedRegs: [],
      regNosTotal: [],
      otherInspAuthority: "",
      remarks: "",
    },
  ],
};


export default function InspectionCertificate({ ol,instrList }) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signatoryList, setSignatoryList] = useState([]);
  const [selectedPrintName, setSelectedPrintName] = useState('');
  const { reset, watch, control, getValues, setValue, handleSubmit } = useForm({
    defaultValues,
  });
  console.log(getValues(), "test");
console.log("OL",ol);

  const submittedName = watch("submittedByName");
  const submittedDesignation = watch("submittedByDesignation");


  const printOptions = [
    { id: 1, name: 'Account Copy' },
    { id: 2, name: 'Account Copy' },
    { id: 3, name: 'OLF Copy' },
    { id: 4, name: 'Consignee Copy' },
    { id: 5, name: 'Account Copy' },
    { id: 6, name: 'Consignee copy' },
    { id: 7, name: 'Office Copy' },
  ];
  const [selectedPrintOption, setSelectedPrintOption] = useState(null);
  const olId=ol?.offerLetterId || ol?.olid
  const getINoteByOlId = () => {
    if (olId) {
      setLoading(true);
      axiosInstance("inote/getINoteByOlIdV2/" + olId)
        .then(({ data }) => {
          // reset({
          //   ...data,
          //   selectedSignatory: data.submittedById,
          //   iNoteLineItems: data.inoteLineItems?.length
          //     ? data.inoteLineItems.map((li) => ({
          //       ...li,
          //       regNos: li.regNos ? li.regNos.map((r) => r) : [],
          //       failedRegs: li.failedRegs ? li.failedRegs.map((r) => r) : [],
          //       regNosTotal: li.regNos,
          //     }))
          //     : [],
          // });
          reset({
            ...data,
            selectedSignatory: data.submittedById,
            inoteLineItems: data.inoteLineItems?.length
              ? data.inoteLineItems.map((li) => ({
                ...li,
                regNos: li.regNos || [],
                failedRegs: li.failedRegs || [],
                regNosTotal: li.regNos || [],
              }))
              : [],
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to get i-note, please try again");
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    getINoteByOlId();
    axiosInstanceMaster(activeSignatoryList + loggedInUser?.orgId)
      .then(({ data }) => setSignatoryList(data))
      .catch((err) => {
        console.log(err);
        toast.error("Failed to get signatory list");
      });
  }, []);

  const onSave = (data) => {
    setSaving(true);
    const req = {
      ...data,
      selectedSignatory: undefined,
      selectedSignatoryObj: undefined,
      createdById: loggedInUser.empId,
      inoteTypeId: 3,
      olId: ol.offerLetterId,
      internalInoteId: ol.internalInoteId,
      submittedById: data?.selectedSignatoryObj?.id || loggedInUser?.empId,
      submittedByName: data?.selectedSignatoryObj?.ename || loggedInUser?.ename
    };

    axiosInstance
      .post(saveINoteUrl, req)
      .then(() => {
        toast.success("I-Note Submitted Successfully.");
        getINoteByOlId();
      })
      .catch((err) => {
        console.log("saveINote error", err);
        toast.error("Failed to submit I-Note, please try again");
      })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={() => instrList?dispatch(selectItem(<CQAIDetailsINote />)):dispatch(selectItem(<ExternalInoteGeneration />))}
        startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
      >
        Back
      </Button>
      {loading && <LinearProgress />}
      <Typography variant="subtitle2" align="right">
        परिशिष्ट  "ख"  / Appendix "B"
      </Typography>
      <Paper style={{ padding: 16, marginTop: 16 }}>
        <Typography variant="h6" align="center">
          <b>निरीक्षण नोट / INSPECTION NOTE</b>
        </Typography>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Typography variant="subtitle2">
              भारत सरकार / GOVERNMENT OF INDIA
              <br />
              रक्षा उत्पादन एवं पूर्ति विभाग / (Department Of Defence Production & Supply)
            </Typography>
          </div>
          <Typography variant="subtitle2">
            प्रति सं / Copy No : <b>{selectedPrintOption?.id} - {selectedPrintOption?.name}</b>, प्रतियों की सं./ No. of Copies 7
          </Typography>
          {/* <b>{selectedPrintOption?.id}</b> */}
        </div>

        <br />
       
        <Typography align="center" variant="subtitle2">
          1. निरीक्षण प्रमाण-पत्र / INSPECTION CERTIFICATE
          <br />
          *पूर्ण/आंशिक/अगले भाग/समापन सुपुर्दगी/ *Delivery in Full/Part/Further Part/Completion
        </Typography>

        <Typography align="right" variant="subtitle2">
          ओ.एल.एफ़ प्र्स्ताव सं./ OLF OFFER No.:
          <Controller
            name="inoteNo"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  size="small"
                  value={value}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
          <br />
          CQAI I/NOTE No.:
          <Controller
            name="cqaeInoteNo"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  style={{ width: 300 }}
                  size="small"
                  value={value}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
        </Typography>

        <Typography variant="subtitle2">
          1 .डीजी(एस एवं डी/निदे.) एस. एवं डी./डी. एस.(टेक्स.)दर/चालू संविदा/ए/आई.सं०. एवं दिनांक
          ................................................. पूर्ति आदेश सं. एवं दिनांक.................................................
          <br />
          D.G. (S&D)/Dir.(S&D)./D.S.(Tex.)Rate/Running Contract/A/I.No. and Date<b>..............................</b> Supply Order No. and
          Date{" "}
          <Controller
            name="supplyOrderNo"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  size="small"
                  value={value}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
          Dt.&nbsp;&nbsp;&nbsp;
          <Controller
            name="supplyOrderDate"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  size="small"
                  type="date"
                  value={moment(value).format("YYYY-MM-DD")}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
         <span>SO.SL.No.</span>
{getValues("inoteLineItems").map((li, i) => (
  <Controller
    key={i} 
    name={`inoteLineItems.${i}.lineItemNo`}
    control={control}
    render={({ field: { onChange, value } }) => (
      <TextField
        size="small"
        value={value || ""} 
        onChange={onChange}
        InputProps={{
          style: { color: "blue" },
        }}
      />
    )}
  />
))}
          <br />
          <br />
          2. संविदाकार का नाम एवं पता / Contract's Name and Address : OPTO ELECTRONICS FACTORY (A UNIT OF IOL), RAIPUR DEHRADUN
          {/* <Controller
            name="contractorName"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  size="small"
                  multiline
                  value={value}
                  onChange={onChange}
                  style={{ minWidth: 500 }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          /> */}
          {/* &nbsp;&nbsp;&nbsp;&nbsp;
          <Controller
            name="contractorAddress"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  size="small"
                  multiline
                  value={value}
                  onChange={onChange}
                  style={{ minWidth: 500 }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          /> */}
          <br />
          3. माँगकर्ता / Indentor :
          <Controller
            name="indentor"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  size="small"
                  value={value}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
          <br />
          <br />
<div
  style={{
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
  }}
>
  <span style={{ whiteSpace: "nowrap" }}>
    4. माँग सं./ Indentor No.
  </span>

  <Controller
    name="orderTypeNo"
    control={control}
    render={({ field: { onChange, value } }) => (
      <TextField
        size="small"
        value={value || ""}
        onChange={onChange}
        variant="standard"
        InputProps={{
          style: {
            color: "blue",
          },
        }}
        style={{
          width: `${Math.max((value || "").length * 8 + 20, 80)}px`,
          minWidth: "80px",
          maxWidth: "100%",
        }}
      />
    )}
  />

  <span style={{ whiteSpace: "nowrap" }}>
    Date
  </span>

  <Controller
    name="orderTypeDate"
    control={control}
    render={({ field: { value } }) => (
      <TextField
        size="small"
        value={value || ""}
        InputProps={{
          readOnly: true,
          style: {
            color: "blue",
          },
        }}
        style={{
          width: "120px",
          flexShrink: 0,
        }}
      />
    )}
  />
</div>
          

          <br />
          <br />
          5. परेषिती(पाने वाला) / Consignee:
          <Controller
            name="consignee"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  multiline
                  style={{ minWidth: 800 }}
                  size="small"
                  value={value}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
          <br />
          <br />
          6. प्रमाणित किया जाता है कि नीचे नोट किए गए तथा संलग्न निरंतर पन्नों में दर्ज सामान का निरीक्षण किया गया है तथा
          परिणाम..........................के रूप में दर्शाया गया है
          <br />
          Certified that stores noted below and in the continuations sheets attached have been inspected with result as shown&nbsp;
          <b>.................................................</b>
          <br />
          <br />
          7. (क) सामान सुपुर्द किया गया/रेल पर रखा गया/निरीक्षण हेतु प्रस्तुत ........................... (ख) सामान का निरीक्षण किया
          ....................... (दिनांक को)
          <br /> (a) Stores delived/put on rail/put up for inspection on&nbsp;&nbsp;&nbsp;
          <Controller
            name="inspectionStart"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  type="date"
                  size="small"
                  value={moment(value).format("YYYY-MM-DD")}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
          &nbsp;&nbsp;&nbsp; &nbsp;(b) Stores Inspection on&nbsp;&nbsp;&nbsp;
          <Controller
            name="inspectionEnd"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TextField
                  type="date"
                  size="small"
                  value={moment(value).format("YYYY-MM-DD")}
                  onChange={onChange}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                />
              );
            }}
          />
          <br />
          <br />
          8. संविदाकार का सुपुर्दगी नोट सं एवं दिनांक / Contract's delivery note no. and date&nbsp;
          <b>.................................................</b>
          <br />
          <br />
          9. वस्तुओं की आपूर्ति निर्धारित समय के भीतर अथवा सक्षम अधिकारी द्वारा विस्तारित समय सीमा के भीतर की गई/नहीं की गई / दंड हेतु
          पूर्ति अधिकारी को अवगत कराया गया .................................................
          <br />
          The items were/were not supplied within the stipulated time or as extended by the competent authority/reference made to Supply
          Officer regarding Penalty <b>.................................................</b>
          <br />
          <br />
        </Typography>

        <Typography align="center" variant="subtitle2">
          <b>निरीक्षित सामान का विवरण / DETAILS OF STORES INSPECTED</b>
        </Typography>
        <table className="i_note">
          <thead>
            <tr>
              <th>
                वस्तु सं. ए/टी में
                <br />
                Item No.in A/T
              </th>
              <th>
                सामान का विवरण. आदेश की गई कुल मात्रा. निरीक्षक उल्लेख करे कि आपूर्ति विक्रेता/खरीददार के कंटेनरों में की गई है, जहाँ सामान
                की आपूर्ति कंटेनरों में की जानी थी।
                <br />
                Description stores Total Quantity ordered The Inspector should indicate Whether the Supply has been made in seller s/buyer's Containers where stores are required to be supplied in Containers
              </th>
              <th>
                लेखाकरण इकाई
                <br />
                Accounting unit
              </th>
              <th>
                निविदा की गई
                <br />
                Tendered
              </th>
              <th>
                स्वीकृत
                <br />
                Accepted
              </th>
              <th>
                खाते (खाता बही) में लाया गया, आज तक की कुल मात्रा (इस आई नोट की मात्रा को छोड़कर)
                <br />
                Brought to account inLedger folio Total Quantity accepted to date (excl. this INote Qty.)
              </th>
              <th>
                अस्वीकृत
                <br />
                Rejected
              </th>
              <th>
                डीजीआईएसएम लंदन अथवा विदेश में अन्य निरीक्षण प्राधिकारी द्वारा प्रदत्त निरीक्षण प्रमाण-पत्र की सं एवं दिनांक
                <br />
                No. and date of Inspection Certificate (if any) issued By D.G.I.S.M London or other Inspection Authority abroad
              </th>
              <th>
                अभ्युक्ति
                <br />
                Remarks
              </th>
            </tr>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
            </tr>
          </thead>
          <tbody>
            {getValues("inoteLineItems").map((li, i) => (
              <tr key={i}>
                <td></td>
                <td>
                  {/* {getValues().nomenclature} */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
  <Controller
    name={`inoteLineItems.${i}.nomenclature`}
    control={control}
    render={({ field: { value } }) => (
      <Typography sx={{ color: "blue" }}>
        <b>{value ?? "-"}</b>
      </Typography>
    )}
  />

                    <Controller
                      name={`inoteLineItems.${i}.itemCategory`}
                      control={control}
                      render={({ field: { value } }) => (
                        <Typography sx={{ color: "blue" }}>
                          <b>{value ?? "-"}</b>
                        </Typography>
                      )}
                    />
                  </Box>
                  Reg. No:
                  <Typography variant="caption" color="secondary">
                    {[
                      ...(watch(`inoteLineItems.${i}.regs`) || []),
                      ...(watch(`inoteLineItems.${i}.failedRegs`) || [])
                    ].map((reg, index, array) => {
                      const isBold = reg?.isSample ;

                      return (
                        <div key={reg?.id || index}>
                          {isBold ? <b>{reg?.serialNo}</b> : reg?.serialNo}
                          {index < array.length - 1 ? "," : ""}
                        </div>
                      );
                    })}
                  </Typography>
                  <br />
                  {/* Failed Reg no:
                  <Typography variant="caption" color="secondary">
                    {watch(`inoteLineItems.${i}.failedRegs`)?.map((reg, index, array) => {
                      const isBold = reg?.isSample;
                      return (
                        <span key={reg?.id || index} >
                          {isBold ? <b>{reg?.serialNo}</b> : reg?.serialNo}
                          {index < array.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </Typography> */}
                  <br />
                  {/* <Controller
                    name={`inoteLineItems.${i}.regNos`}
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        multiple
                        options={getValues(`inoteLineItems.${i}.regNosTotal`) || []}
                        disableCloseOnSelect
                        onChange={(_, v) => {
                          onChange(v);
                          setValue(`inoteLineItems.${i}.tendered`, v.length || 0);
                        }}
                        value={value || []}
                        getOptionLabel={(option) => option}
                        getOptionSelected={(o, v) => o === v}
                        groupBy={(o) => o.date}
                        renderOption={(option, { selected }) => {
                          return (
                            <>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 2 }}
                                checked={selected}
                                color="primary"
                              />
                              {option}
                            </>
                          );
                        }}
                        // renderTags={(v) => <span>Reg nos: {v.length || 0}</span>}
                        // renderInput={(params) => <TextField {...params} fullWidth size="small" error={error} helperText={error?.message} />}
                      />
                    )}
                  /> */}
                </td>
                <td>
                  {/* <Controller
                    name={`inoteLineItems.${i}.uom`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          size="small"
                          value={value}
                          onChange={onChange}
                          InputProps={{
                            style: { color: "blue" },
                          }}
                        />
                      );
                    }}
                  /> */}
                  <Controller
 name={`inoteLineItems.${i}.uom`}
  control={control}
  render={({ field: { value } }) => (
    <Typography sx={{ color: "blue" }}>
      {value ?? "-"}
    </Typography>
  )}
/>
                </td>
                <td>
                  {/* <Controller
                    name={`inoteLineItems.${i}.tendered`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          type="number"
                          size="small"
                          value={value}
                          onChange={onChange}
                          InputProps={{
                            readOnly: true,
                            style: { color: "blue" },
                          }}
                        />
                      );
                    }}
                  /> */}
                  <Controller
  name={`inoteLineItems.${i}.tendered`}
  control={control}
  render={({ field: { value } }) => (
    <Typography sx={{ color: "blue" }}>
      {value ?? "-"}
    </Typography>
  )}
/>
                </td>
                <td>
                  {/* <Controller
                    name={`inoteLineItems.${i}.accepted`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          type="number"
                          size="small"
                          value={value}
                          onChange={onChange}
                          InputProps={{
                            style: { color: "blue" },
                          }}
                        />
                      );
                    }}
                  /> */}
                  <Controller
  name={`inoteLineItems.${i}.accepted`}
  control={control}
  render={({ field: { value } }) => (
    <Typography sx={{ color: "blue" }}>
      {value ?? "-"}
    </Typography>
  )}
/>
                </td>
                <td>
                  {/* <Controller
                    name={`inoteLineItems.${i}.ledgerFolio`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          type="number"
                          size="small"
                          value={value}
                          onChange={onChange}
                          InputProps={{
                            style: { color: "blue" },
                          }}
                        />
                      );
                    }}
                  /> */}
                   <Controller
  name={`inoteLineItems.${i}.ledgerFolio`}
  control={control}
  render={({ field: { value } }) => (
    <Typography sx={{ color: "blue" }}>
      {value ?? 0}
    </Typography>
  )}
/>
                </td>
                <td>
                
                  {/* <Controller
                    name={`inoteLineItems.${i}.rejected`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          type="number"
                          size="small"
                          value={value}
                          onChange={onChange}
                          InputProps={{
                            style: { color: "blue" },
                          }}
                        />
                      );
                    }}
                  /> */}
                  <Controller
  name={`inoteLineItems.${i}.rejected`}
  control={control}
  render={({ field: { value } }) => (
    <Typography sx={{ color: "blue" }}>
      {value ?? "-"}
    </Typography>
  )}
/>
                </td>
                <td>

 <Typography style={{ fontSize: 14 }}>
  370005/MGS BR/OS16-B
</Typography>

<Typography style={{ fontSize: 14 }}>
  <span style={{ color: "black" }}>
    CONTRACT NO: {watch("supplyOrderNo") ?? "-"}
  </span>
  &nbsp;&nbsp;
  <span style={{ fontSize: 12 }}>DATED</span>
  &nbsp;
  <span style={{ color: "black" }}>
    {watch("supplyOrderDate")
      ? moment(watch("supplyOrderDate")).format("DD-MM-YYYY")
      : "-"}
  </span>
</Typography>

                </td>
                <td>
                  <Controller
                    name={`inoteLineItems.${i}.failedParamDesc`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          size="small"
                          value={value}
                          onChange={onChange}
                          variant="outlined"
                          
                          InputProps={{
                            style: { color: "blue" },
                          }}
                        />
                      );
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
       <Typography align="center" variant="subtitle2">
  निरीक्षित वस्तुओं की सं. / ITEMS INSPECTED NO.&nbsp;
  <b style={{ color: "blue" }}>
    {getValues("inoteLineItems")
      ?.map(li =>
        li?.tendered
          ? converter.toWords(Number(li.tendered)).toUpperCase()
          : "-"
      )
      .join(", ")}
  </b>
  &nbsp; (शब्दों में) / (In Words)
</Typography>
        <Typography>
          स्थान /Station:.......
        </Typography>

        <Typography>
          दिनांक /Date: {getValues()?.inoteDate ? moment(getValues().inoteDate).format("DD-MM-yyyy") : moment(new Date()).format("DD-MM-yyyy")}
        </Typography>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* <Controller
            name="selectedSignatory"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CustomizedInputs
                  select
                  style={{ width: 300 }}
                  labelText="Select Signatory"
                  SelectProps={{ native: true }}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(e);

                    const signObj = signatoryList.find((s) => s.id === +val);
                    setValue("selectedSignatoryObj", signObj);
                  }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  value={value}
                >
                  <option value="">Select</option>
                  {signatoryList.map((sig) => (
                    <option key={sig.id} value={sig.id}>
                      {sig.ename}
                    </option>
                  ))}
                </CustomizedInputs>
              );
            }}
          /> */}
          <Typography variant="subtitle2">

          <b style={{ minHeight: '1.5em', display: 'block' }}>
              {submittedName ? submittedName : ""}
            </b>
            
            <span style={{ display: 'block', minHeight: '1.2em' }}>
              {submittedDesignation ? submittedDesignation : ""}
            </span>

              {/* <b>{loggedInUser.ename}</b>  */}
                    {/* (Quality Control Officer) */}
             
                    {/* For Chief General Manager
                    <br />
                    OLF,Raipur,Dehradun */}
                    {/* Lt.COL. */}
                    FOR CONTROLLER
                    </Typography>
        </div>


        <div style={{ textAlign: "left", marginTop: "40px" }}>
          <Typography variant="body2">
            <b>नोट : यह दस्तावेज़ ऑनलाइन जारी तथा डिजिटल रूप में हस्ताक्षरित है, भौतिक हस्ताक्षर की आवश्यकता नहीं है।</b>
            <br />
            <b>Note :- This document is online generated & digitally signed, physical signature is not required.</b>
          </Typography>
        </div>
      
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 16 }}>
        <Controller
            name="selectedPrintOption"
            control={control}
            render={({ field: { onChange, value },fieldState:{error} }) => {
              return (
                <AutoCompleteNew data={printOptions}
                  getOptionLabel={(option) => option.name}
                  label={"Select Copy"}
                  style={{width:'200px'}}
                  value={value}
                  onChange={(e, value) => {
                    setSelectedPrintOption(value)
                    console.log(value,"printOptions")
                  }} 
                  error={error}
                  helperText={error?.message}
                  />
              );
            }}
          />
          <Button
            startIcon={<Print />}
            disabled={!getValues("inoteDate")}
            onClick={() => generatePDF(getValues(),selectedPrintOption,converter)}
            style={{ textTransform: "capitalize" }}
            size="small"
            variant="outlined"
            color="primary"
          >
            Print
          </Button>
          <Button
            startIcon={<SendOutlined />}
            disabled={saving || loading || getValues("inoteDate")}
            onClick={handleSubmit(onSave)}
            style={{ textTransform: "capitalize" }}
            size="small"
            color="secondary"
            variant="outlined"
          >
            {saving ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </div>
      </Paper>
    </>
  );
}

