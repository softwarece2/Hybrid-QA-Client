/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import SvgIcon from "@material-ui/core/SvgIcon";
import { alpha, makeStyles, withStyles } from "@material-ui/core/styles";
import axiosInstance from "pages/Services/AxiosInstance";
import _ from "lodash";
import { getDGQAHierarchy } from "pages/Services/URLs";
import { LinearProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  closeIcon: {
    position: "absolute",
    right: "0",
    top: "0",
  },
  closeColor: {
    color: theme.palette.common.white,
  },
}));

const initialState = {
  mouseX: null,
  mouseY: null,
};
function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}
const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    "& .close": {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => <TreeItem {...props} />);



export default function DGQAHierarchy() {
  const classes = useStyles();
  const [state, setState] = useState(initialState);
  const [treeData, setTreeData] = useState([]);
  const [selctedItem, setSelctedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTreeItemClick = (event, item) => {

    event.preventDefault();
    event.stopPropagation();

    setSelctedItem(item);
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  useEffect(() => {
    getAllOrgsHierarchy();
  }, []);

  const getAllOrgsHierarchy = async () => {
    setLoading(true);
    await axiosInstance(getDGQAHierarchy)
      .then(({ data }) => {
        setTreeData(recursiveLists(data));
      })
      .catch((e) => {
        setTreeData([]);
        console.log(e);
      }).finally(()=>{
        setLoading(false);
      });
  };

  const getTreeItemsFromData = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let children;
      if (treeItemData.child && treeItemData.child.length > 0) {
        children = getTreeItemsFromData(treeItemData.child);
      }
      return (
        <StyledTreeItem
          onContextMenu={(e) => handleTreeItemClick(e, treeItemData)}
          key={treeItemData.id}
          nodeId={treeItemData.id}
          label={treeItemData.organizationName}
          children={children}
        />
      );
    });
  };

  const recursiveLists = (data) => {
    const grouped = _.groupBy(data, (item) => item.parentOrgId);

    function childrenOf(parentOrgId) {
      return (grouped[parentOrgId] || []).map((item) => ({
        id: item.id,
        organizationName: item.organizationName,
        child: childrenOf(item.id),
      }));
    }

    return childrenOf("0");
  };

  return (
    <div>
      {loading && <LinearProgress/>}
      <TreeView
        className={classes.root}
        defaultExpanded={["1"]}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
      >
        <div style={{ cursor: "context-menu" }}>{getTreeItemsFromData(treeData)}</div>
      </TreeView>

    </div>
  );
}