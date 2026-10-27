/* eslint-disable no-unused-vars */
import * as React from "react";
import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
/* eslint-enable no-unused-vars */

class MTableAction extends React.Component {
  render() {
    let action = this.props.action;

    if (typeof action === "function") {
      action = action(this.props.data);
      if (!action) {
        return null;
      }
    }

    if (action.action) {
      action = action.action(this.props.data);
      if (!action) {
        return null;
      }
    }

    if (action.hidden) {
      return null;
    }

    const disabled = action.disabled || this.props.disabled;

    const handleOnClick = (event) => {
      if (action.onClick) {
        action.onClick(event, this.props.data);
        event.stopPropagation();
      }
    };

    const icon =
      typeof action.icon === "string" ? (
        <Icon {...action.iconProps}>{action.icon}</Icon>
      ) : typeof action.icon === "function" ? (
        action.icon({ ...action.iconProps, disabled: disabled })
      ) : (
        <action.icon />
      );

    const button = (
      <button
        style={{ outline: "none", backgroundColor: "transparent", border: "none" }}
        size={this.props.size}
        color="inherit"
        disabled={disabled}
        onClick={handleOnClick}
      >
        {icon}
      </button>
    );

    if (action.tooltip) {
      // fix for issue #1049
      // https://github.com/mbrn/material-table/issues/1049
      return disabled ? <span>{button}</span> : <Tooltip title={action.tooltip}>{button}</Tooltip>;
    } else {
      return button;
    }
  }
}

MTableAction.defaultProps = {
  action: {},
  data: {},
};

MTableAction.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  disabled: PropTypes.bool,
  size: PropTypes.string,
};

export default MTableAction;
