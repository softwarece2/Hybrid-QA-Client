import React from "react";
import { TextField } from "@material-ui/core";
import { IMaskMixin } from "react-imask";

export const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <TextField {...props} inputRef={inputRef} />
));
