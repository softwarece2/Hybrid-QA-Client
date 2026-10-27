import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
// import { useDispatch } from "react-redux";

export function useForm(initialFValues, validateOnChange = false, validate) {
  // const dispatch = useDispatch();

  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});
  // const [value, setValue] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (validateOnChange) validate({ [name]: value });
  };

  function onChange(val) {
    if (val != null && val.length > 0) {
      // setValue(val);

      console.log("timestamp", val[0]._d);
      var event = new Date(val[0]._d);
      var event2 = new Date(val[1]._d);
      let date1 = JSON.stringify(event);
      let date2 = JSON.stringify(event2);
      date1 = date1.slice(1, 11);
      console.log("date1", date1);
      date2 = date2.slice(1, 11);
      console.log("date2", date2);
      const week = date1 + " to " + date2;
      setValues({
        ...values,
        duration: week,
      });
    }
  }

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    onChange,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));

export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {props.children}
    </form>
  );
}
