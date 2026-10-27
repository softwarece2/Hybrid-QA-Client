import Switch from "@material-ui/core/Switch";

export default function Switches({ mode, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 32 }}>
      <span>View Mode</span>
      <span>
        <Switch color="primary" checked={mode} onChange={onChange} />
      </span>
      <span>Edit Mode</span>
    </div>
  );
}
