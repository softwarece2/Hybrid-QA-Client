import { Checkbox, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState, useEffect } from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function SelectAllAutocomplete({ initialOptions, onChange, ...others }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
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
      // Deselect all
      setSelectedOptions([]);
      setAllSelected(true);
      onChange([]);
    } else {
      // Select all
      const filteredOptions = initialOptions.filter((el) => !el?.value);
      setSelectedOptions(filteredOptions);
      onChange(filteredOptions);
      setAllSelected(true);
    }
  };

  return (
    <Autocomplete
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
      disableCloseOnSelect
      onChange={(_, v) => {
        onChange(v);
        setSelectedOptions(v);
      }}
      value={selectedOptions}
      getOptionLabel={(option) => option.lineItemSerialNo}
      getOptionSelected={(o, v) => o.id === v?.id}
      //groupBy={(o) => o.date}
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
  );
}

export default SelectAllAutocomplete;
