import AsyncSelect from "react-select/async-creatable";
import { components } from "react-select";
import { ClearIndicator, selectStyles } from "./configs";
import DeleteModal from "@components/@core/deleteModal";
import debounce from "debounce-promise";
import { FormContextValues } from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  useDisclosure
} from "@chakra-ui/core";
import { isBrowser } from "@static/constants";
import React, { useEffect, useState } from "react";

interface ISelectProps {
  name: string;
  label?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  multiple?: boolean;
  style?: any;
  onQuery?: any;
  debounceTime?: number;
  deleteMessage?: string;
  deleteTitle?: string;
  optionComponent?: any;
  placeholder?: string;
  onChange?;
  onDelete?;
  selectRef?;
  form: FormContextValues<any>;
  resetOnSubmit?;
}

const dummyOnQuery = (q) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ label: `async-${q}`, value: "vx" }]);
    }, 1000);
  });

const DefaultOptionComponent = (p) => <components.Option {...p} />;

const SelectAsyncInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  options = [],
  multiple = false,
  disabled = false,
  optionComponent = DefaultOptionComponent,
  debounceTime = 200,
  placeholder,
  onChange,
  onDelete,
  deleteMessage,
  deleteTitle,
  selectRef,
  onQuery = dummyOnQuery,
  resetOnSubmit = true,
  ...props
}: ISelectProps) => {
  const initialValue = form.control.defaultValuesRef.current[name];
  const onQueryDebounce = debounce(onQuery, debounceTime);
  const [preSelected, setPreSelected] = useState({ delete: [], currtVal: [] });
  const [deleted, setDeleted] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(
    initialValue ? (multiple ? initialValue : { value: initialValue }) : null
  );

  const handleSelected = (val) => {
    if ((selected?.length == 1 && !val) || val?.length <= selected?.length) {
      const filtered = val
        ? selected.filter((obj) => !val.some((obj2) => obj.value == obj2.value))
        : selected;
      setPreSelected({ delete: filtered, currtVal: val });
      onOpen();
    } else {
      setSelected(val);
    }
  };

  const removeSelected = () => {
    setDeleted(preSelected.delete[0]);
    setSelected(preSelected.currtVal);
  };

  useEffect(() => {
    if (onDelete) {
      onDelete(deleted, name);
    }
  }, [deleted]);

  useEffect(() => {
    form.setValue(name, multiple ? selected : selected?.value);
    form.triggerValidation(name);
    if (onChange && selected) {
      onChange(deleted, name);
    }
  }, [selected]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  useEffect(() => {
    if (resetOnSubmit && form.formState.submitCount) {
      setSelected(multiple ? [] : null);
    }
  }, [form.formState.submitCount]);

  return (
    <div>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        message={deleteMessage}
        title={deleteTitle}
        handleDelete={removeSelected}
      />
      <FormControl
        isInvalid={form.errors[name] && true}
        data-select-invalid={form.errors[name] && true}
        mb={mb}
        {...props}
      >
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <AsyncSelect
          name={name}
          inputId={name}
          menuPortalTarget={isBrowser && document.body}
          formatCreateLabel={(v) => `Add "${v}"`}
          isMulti={multiple}
          defaultOptions={options}
          loadOptions={onQueryDebounce}
          components={{
            Option: optionComponent,
            ClearIndicator,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null
          }}
          value={selected}
          isSearchable={true}
          isDisabled={disabled}
          isClearable={true}
          onChange={handleSelected}
          placeholder={placeholder || label}
          noOptionsMessage={() => null}
          styles={selectStyles}
          ref={selectRef}
        />
        <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default SelectAsyncInputField;
