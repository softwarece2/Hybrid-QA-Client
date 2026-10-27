import { SvgIcon } from "@material-ui/core";

export function MinimizeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M20 14H4v-4h16v4z" />
    </SvgIcon>
  );
}

export function MaximizeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>
    </SvgIcon>
  );
}
export function CloseIcon(props) {
  return (
    <SvgIcon {...props}>
     <path d="M6 6l12 12M6 18L18 6"/>
    </SvgIcon>
  );
}
