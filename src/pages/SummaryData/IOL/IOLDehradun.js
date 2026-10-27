/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button, FormControl, InputLabel, Select, TextField, Typography } from "@material-ui/core";
//
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import ChartView from "./ChartView";
import { toast } from "react-toastify";
import IOLChartView from "./Chart";
import { PRODUCT_ID } from "Globals.js";
// import IOLTVNEChartView from "./tvne";
// import DataView from "./DataView";
// import { toast } from "react-toastify";

const today = new Date();
const year = today.getMonth() < 3 ? today.getFullYear() - 1 : today.getFullYear();
const oneApril = new Date(year, 3, 1);

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function IOLDehradun() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [testTypes, setTestTypes] = useState([]);
  const [selectedTestType, setSelectedTestType] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [toDate, setToDate] = useState(formatDate(today));
  const [fromDate, setFromDate] = useState(formatDate(oneApril));
  const [specs, setSpecs] = useState({});
  const [params, setParams] = useState({});

  useEffect(() => {
    axiosInstanceAte("spec/getAllProductWithEpCode")
      .then(({ data }) => {
        setProducts(data);
        // setSelectedProduct(data[0]?.id);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    setTestTypes([]);
    if (selectedProduct) {
      axiosInstanceAte(`spec/getTestsByProdId/${selectedProduct}`)
        .then(({ data }) => {
          setTestTypes(data);
        })
        .catch(console.log);
    }
  }, [selectedProduct]);

  async function handleSubmit() {
    if (selectedTestType) {
      setParams({
        toDate,
        fromDate,
        selectedProduct: selectedProduct || undefined,
        selectedTestType: selectedTestType || undefined,
        // specObj: selectedProduct == PRODUCT_ID.TPDK ? undefined :  specs.specDtos?.find((s) => s.specId === +selectedSpec),
        counter: (params?.counter || 0) + 1,
      });
    } else {
      toast.info("Please select test");
    }
  }

  async function getSpecs(productId, testTypeId) {
    try {
      const { data } = await axiosInstanceAte(`dash/getGraphSpecs/${productId}/${testTypeId}`);
      setSpecs(data);
    } catch (err) {
      console.log("error", err);
    }
  }

  return (
    <div style={{ border: "1px solid skyblue", borderRadius: 8 }}>
   <div style={{ paddingInline: 16 }}>
        <div style={{ display: "flex", gap: 8, paddingBlock: 8 }}>
          {/* <FormControl style={{ minWidth: 200 }} variant="outlined" size="small">
            <InputLabel shrink>Product</InputLabel>
            <Select
              native
              labelId="product-select-label"
              id="product-select"
              label="Product"
              value={selectedProduct}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setSelectedProduct(+val);
                  setSelectedTestType();
                  setSelectedSpec();
                  setParams({});
                } else {
                  setSelectedProduct();
                }
              }}
            >
              <option value="">Select Product</option>

              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.prodName}
                </option>
              ))}
            </Select>
          </FormControl> */}

          {/* <FormControl style={{ maxWidth: 200 }} variant="outlined" size="small">
            <InputLabel shrink>Test Type</InputLabel>
            <Select
              native
              labelId="test-select-label"
              id="test-select"
              label="Test Type"
              value={selectedTestType}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  getSpecs(selectedProduct, val);
                  setSelectedTestType(+val);
                  setSelectedSpec();
                  setParams({});
                } else {
                  setSelectedTestType();
                }
              }}
            >
              <option value="">Select test</option>

              {testTypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.testName}
                </option>
              ))}
            </Select>
          </FormControl> */}

          {/* <FormControl style={{ maxWidth: 200 }} variant="outlined" size="small"> */}
          </div>
          </div>
          
    <>
    <div style={{ display: "flex", gap: 8, marginBottom: 16,marginLeft:"20px" }}>
        <FormControl style={{ width: 300 }} variant="outlined" size="small">
          <Typography>Product-EP Code</Typography>
          <Select
            native
            labelId="product-select-label"
            id="product-select"
            // label="Product-EP Code"
            variant="outlined"
            value={selectedProduct}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                setSelectedProduct(+val);
                setSelectedTestType("");
                setSelectedSpec("");
                setParams({});
              } else {
                setSelectedProduct("");
              }
            }}
          >
            <option value="">Select Product-EP Code</option>

            {products.map((p) => (
              <option key={p.productId} value={p.productId}>
                {p.productNameEpCode}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: 300 }} variant="outlined" size="small">
          <Typography>TestType</Typography>
          <Select
            native
            labelId="test-select-label"
            id="test-select"
            label="Test Type"
            value={selectedTestType}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                getSpecs(selectedProduct, val);
                setSelectedTestType(+val);
                setSelectedSpec("");
                setParams({});
              } else {
                setSelectedTestType("");
              }
            }}
          >
            <option value="">Select test</option>

            {testTypes.map((p) => (
              <option key={p.testId} value={p.testId}>
                {p.testName}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* {selectedProduct == PRODUCT_ID.TPDK && (
          <FormControl style={{ width: 300 }} variant="outlined" size="small">
            <InputLabel shrink>Specification</InputLabel>
            <Select
              native
              labelId="test-select-label"
              id="spec-test"
              label="Specification"
              value={selectedSpec}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setSelectedSpec(val);
                } else {
                  setSelectedSpec("");
                }
              }}
            >
              <option value="">Select Spec</option>
              {specs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.graphTitle.substring(0, 99) + "..."}
                </option>
              ))}
            </Select>
          </FormControl>
        )} */}
<FormControl style={{ width: 300 }} variant="outlined" size="small">
   <Typography>From Date</Typography>
        <TextField
          size="small"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          type="date"
      
          onChange={(e) => setFromDate(e.target.value)}
          value={fromDate}
        />
</FormControl>
<FormControl style={{ width: 300 }} variant="outlined" size="small">
   <Typography>To Date</Typography>
        <TextField
          size="small"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          type="date"
        
          onChange={(e) => setToDate(e.target.value)}
          value={toDate}
        />
        </FormControl>
        <FormControl style={{ width: 100 }} variant="outlined" size="small" >
           
        <Button onClick={handleSubmit} variant="outlined" color="primary" style={{marginTop:"24px"}}>
          
          Submit
        </Button>
        </FormControl>
      </div>
    
      <RenderDashboard params={params} specs={specs} />
    </>
    </div>
  );
}

function RenderDashboard({ params, specs }) {
  if (!params.selectedTestType) {
    return (
      <Typography align="center" variant="h6" color="textSecondary" style={{ paddingBlock: 20 }}>
        Select Product
      </Typography>
    );
  }
  if (params.selectedProduct == PRODUCT_ID.TPDK) {
    return (
      <IOLChartView
        params={{
          toDate: params.toDate,
          fromDate: params.fromDate,
          productTypeId: params.selectedProduct,
          testTypeId: params.selectedTestType,
          counter: (params?.counter || 0) + 1,
        }}
      />
    );
  }
  // if (params.selectedProduct == 110 ||params.selectedProduct == 111 || params.selectedProduct == 112 ) {
  //   return (
  //     <IOLTVNEChartView
  //       params={{
  //         toDate: params.toDate,
  //         fromDate: params.fromDate,
  //         productTypeId: params.selectedProduct,
  //         testTypeId: params.selectedTestType,
  //         counter: (params?.counter || 0) + 1,
  //       }}
  //     />
  //   );
  // }

  return <ChartView params={params} specs={specs} />;
}

export function WorkInProgress() {
  return (
    <Typography align="center" variant="h6" color="textSecondary" style={{ paddingBlock: 20 }}>
      Work in progress!
    </Typography>
  );
}
