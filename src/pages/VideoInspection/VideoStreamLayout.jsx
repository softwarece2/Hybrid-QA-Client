/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import { WidthProvider, Responsive, Layout } from "react-grid-layout";
// import '../../node_modules/react-grid-layout/css/styles.css';
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import MinimizeIcon from "@material-ui/icons/Minimize";
import "./style.css";
import InnerComponent from "./InnerComponent";
import { Button, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Close } from "@material-ui/icons";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const n = 2;

const VideoStreamLayout = ({ meetingId }) => {
  
  const [items, setItems] = useState(() =>
    [0].map((i) => ({
      i: i.toString(),
      x: i,
      y: 0,
      w: 1,
      h: 6,
    }))
  );
  const [newCounter, setNewCounter] = useState(1);

  const onAddItem = useCallback(() => {
    setItems((prevItems) => [
      ...prevItems,
      {
        i: "" + newCounter,
        x: prevItems.length % n,
        y: Infinity, // puts it at the bottom
        w: 1,
        h: 6,
      },
    ]);
    console.log(newCounter, "cccc");
    setNewCounter((prevCounter) => prevCounter + 1);
  }, [newCounter]);

  const onRemoveItem = (e, i) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("clicked", i);
    setItems((prevItems) => prevItems.filter((e) => e.i !== i));
  };

  const onMinimizeItem = (e, i) => {
    console.log(items[i]);
    e.stopPropagation();
    e.preventDefault();
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.i === i) {
          return { ...item, h: item.h === 0 ? 6 : 0 }; // Toggle height between 1 and 6
        }
        return item;
      })
    );
  };

  const createElement = (el) => {
    // const item = <span className='text'>{el.i}</span>;

    return (
      <div
        key={el.i}
        data-grid={el}
        style={{
          border: "1px solid lightgrey",
          position: "relative",
          marginBottom: "100px",
        }}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <p style={{ overflow: "auto", height: "100%", padding: "2" }}>
          <InnerComponent meetingId={meetingId} />
        </p>
        <div
          style={{
            position: "absolute",
            top: -35,
            // padding: 20,
            border: "1px solid lightblue",
            borderBottom: "none",
            // display: 'flex',
            // justifyContent: 'end',
            textAlign: "right",
            // background: "lightblue",
            width: "100%",
            backgroundColor: "lightblue",
          }}
        >
          <Tooltip title={items[el.i]?.h === 0 ? "Maximize" : "Minimize"}>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => onMinimizeItem(e, el.i)}
            >
              {items[el.i]?.h === 0 ? <ZoomOutMapIcon /> : <MinimizeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                onRemoveItem(e, el.i);
                console.log("ujyiuiuiui");
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </div>

        {/* <button onClick={(e) => onRemoveItem(e, el.i)}>delete</button> */}
      </div>
    );
  };

  return (
    <>
      <div style={{ padding: "20px 20px 42px 0px" }}>
        <Button onClick={onAddItem} color="primary" variant="outlined">
          <PersonAddIcon />
          &nbsp; Add More
        </Button>
      </div>
      <div>
        {/* <Button onClick={onAddItem}>Add Item</Button> */}

        <ResponsiveReactGridLayout
          cols={{ lg: n, md: n, sm: 1, xs: 1, xxs: 1 }}
          rowHeight={25} // to change the height of the each element
          resizeHandles={["se"]}
          margin={[10, 90]} // Add margin to create space between grid items
        >
          {items.map((el) => createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    </>
  );
};

export default VideoStreamLayout;
