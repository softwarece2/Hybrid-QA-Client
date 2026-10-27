import { useEffect,useRef, useState } from "react";
import "../../../App.css";

//component
import TableComponent from "components/table/index";
import { useReactToPrint } from "react-to-print";
//material-ui
import { Grid} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Button from "components/Button";
import axiosInstance from "pages/Services/AxiosInstance";
import { toast } from "react-toastify";
import CustomizedInputs from "components/TextField";
import * as File from 'xlsx'; 
import jsPDF  from "jspdf";
import 'jspdf-autotable';
const columns = [
  {
    title: 'Order No.',
    field: 'orderNo',
    width: 'auto',
    filtering: true,
  },
  {
    title: 'Item code',
    field: 'partNo',
    width: 'auto',
    filtering: true,
  },
  {
    title: 'Item SI NO',
    field: 'lineItemNo',
    width: 'auto',
    filtering: true,
  },
  {
    title: 'Item Description',
    field: 'description',
    width: 'auto',
    filtering: true,
  },
  {
    title: 'Indentor',
    field: 'indenterName',
    width: 'auto',
    filtering: true,
  },
  {
    title: 'Consignee',
    field: 'consigneeName',
    width: 'auto',
    sorting: true,
  },
  {
    title: 'SO No/Contract No & Date',
    field: 'orderDetails',
    width: 'auto',
  },
  {
    title: 'Qty',
    field: 'totalQty',
    width: 'auto',
  },
  {
    title: 'Inspection authority',
    field: 'inspectionAuthorityName',
    width: 'auto',
  },
];

export default function EpcodeTable() {
  const dispatch = useDispatch();
  const [selectedEpCode, setSelectedEpCode] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const componentRef = useRef();
  const [epcodes, setEpcodes] = useState([]);
  const [epcodesLoaded, setEpcodesLoaded] = useState(false);

  const { control,watch, setValue } = useForm({
    mode: "onChange",
  });
  
  const handleDownload = () => {
  
    const transformedRecords = records.map(record => {
      const newRecord = {};
      columns.forEach(column => {
        newRecord[column.title] = record[column.field]; 
      });
      return newRecord;
    });

  
    var wb = File.utils.book_new();
    var ws = File.utils.json_to_sheet(transformedRecords);
    File.utils.book_append_sheet(wb, ws, "myFile");
    File.writeFile(wb, "epcode.xlsx");
  };
  const watchSelectedEpCode = watch("EpcodeId");
  async function getEpcodes(){
    try {
      const { data } = await axiosInstance("partNumber/getAll");
      setEpcodes(data);

    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    getEpcodes();
   
  }, []);

  useEffect(() => {
    if (epcodes.length > 0 && !epcodesLoaded) {
      const firstEpCode = epcodes[0];
      setSelectedEpCode(firstEpCode.id);
      setValue("EpcodeId", firstEpCode.id);
      fetchEpCodeData(firstEpCode.id);
      setEpcodesLoaded(true); 
    }
  }, [epcodes, setValue, epcodesLoaded]);
 
  useEffect(() => {
    if (watchSelectedEpCode) {
      fetchEpCodeData(watchSelectedEpCode);
    } else {
      setRecords([]);
    }
  }, [watchSelectedEpCode]);

  const fetchEpCodeData = async (epcodes)=> {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/partNumber/getDetailsBypartNumberId/${epcodes}`);
      setRecords(response.data);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching EpCode data:", error);
      toast.error("Error fetching EpCode data.");
    } finally {
      setLoading(false);
    }
  };

  // const options = componentRef.current ? {pageSizeOptions :false } : {};
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: "EP CODE Details",
  //   options: options 
  // });
  const handlePrint=()=>{
    const doc = new jsPDF({
      orientation: 'landscape' 
  });
    doc.autoTable({
      columns:columns.map(col=>({...col,dataKey:col.field})),
      body:records,
    });
  doc.save("EpcodeTable.pdf");
   }
  return (

    <Grid container >
      
   
             <Grid item xs={12} sm={2}>
            <Controller
              name="EpcodeId"
              control={control}
              render={({
                field: { onChange, value },
                fieldState:{ error },
              }) => (
                <CustomizedInputs
                  select
                  size="small"
                  SelectProps={{ native : true }}
                  labelText="Ep Code"
                  placeholder="EP Code"
                  required
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message}
                >
                  <option value="">Select EP Code</option>
                  {epcodes.map((item) => (
                    <option key={item.id} value={item.id}>{item.partNo}</option>
                  ))}
                </CustomizedInputs>
              )}
              
            />
           <div style={{  marginLeft: '1480px',display: "flex", width:'200px',paddingInline:8,justifyContent:"space-between"  }}> 
               
          <Button variant="contained" color="primary" size="small" onClick={handleDownload}>
            Download Excel
          </Button>
              </div>
      </Grid>
    
      <Grid item xs={12}>
      
                    <div ref={componentRef} style={{width:'100%'}} > 
                        <TableComponent
                         isLoading={loading}
                            data={records}
                            columns={columns}
                            title=""
                            options={{ filtering: false, search: false}}
                        
                        />
                        
                    </div>
                
      </Grid>
      <Button style={{ textTransform: "capitalize",marginTop:'40px' }} onClick={handlePrint} variant="contained" color="primary" >
          Print
        </Button>
    </Grid>

  );
}