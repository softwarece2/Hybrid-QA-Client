import { Checkbox, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState, useEffect } from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import React, { useMemo } from 'react';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
function SelectAllUpdateAutocomplete({ initialOptions, onChange, value, selectedOptions, setSelectedOptions, ...others  }) {
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    // Initialize allSelected based on initial options
    if (
      initialOptions.length > 0 &&
      selectedOptions.length === initialOptions.length
    ) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [initialOptions, selectedOptions]);

  
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedOptions([]);
      setAllSelected(true);
      onChange([]); // Deselect everything in the Form State
    } else {
      const filteredOptions = initialOptions.filter((el) => !el?.value);
      setSelectedOptions(filteredOptions);
      onChange(filteredOptions);
      setAllSelected(true);
    }
  };

  return (
    <Autocomplete
      {...others}
      multiple
      options={
        (initialOptions?.length > 0 && [
          {
            label: "All",
            value: "select-all",
            lineItemSerialNo: "All",
          },
          ...initialOptions,
        ]) ||
        []
      }
      // 5. MUST use the value from the Controller
      value={selectedOptions} 
      disableCloseOnSelect
      
      onChange={(_, v) => {
        onChange(v);
        setSelectedOptions(v);
      }}
      getOptionLabel={(option) => option.lineItemSerialNo || ""}
      renderOption={(option, { selected }) => {
        if (option.value === "select-all") {
          return (
            <li
              key={option.value}
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
            >
              <Checkbox
                checked={allSelected}
                color="primary"
                style={{ marginRight: 2 }}
              />
              {option.label}
            </li>
          );
        }
        if (option.label) {
          // It's a group label
          return (
            <div
              style={{
                fontWeight: "bold",
                margin: "5px 0",
              }}
            >
              {option.label}
            </div>
          );
        } else {
          return (
            <>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 2 }}
                checked={selected}
                color="primary"
              />
              {option.lineItemSerialNo}
            </>
          );
        }
      }}
      renderTags={(v) => <span>Selected Reg nos: {v.length}</span>}
      renderInput={(params) => (
        <TextField
          variant="outlined"
          {...params}
          id="my-input"
          fullWidth
          size="small"
          aria-describedby="my-helper-text"
          //  error={error}
          //  helperText={error?.message}
        />
      )}
      filterOptions={(options, { inputValue }) => {
        if (inputValue === "") {
          return options;
        } else {
          const filteredOptions = options.filter((option) =>
            option.lineItemSerialNo.toLowerCase().includes(inputValue.toLowerCase())
          );

          return filteredOptions;
        }
      }}
      {...others}
    />
    //   renderTags={(v) => <span style={{ fontSize: '12px' }}>Selected Reg nos: {v.length}</span>}
    //   renderInput={(params) => (
    //     <TextField
    //     variant="outlined"
    //     {...params}
    //     id="my-input"
    //     fullWidth
    //     size="small"
    //     aria-describedby="my-helper-text"
    //     //  error={error}
    //     //  helperText={error?.message}
    //   />
    //   )}
    // />
  );
}



export default SelectAllUpdateAutocomplete;
