import { CheckboxGroup, Image, Stack, VisuallyHidden } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import { getLocalIcon } from "@utils/media";
import React from "react";

export interface ITraitInputProps {
  type?: string;
  options: any[];
  gridColumns?;
  onBlur?;
  onChange;
  defaultValue?;
}

const CustomCheckbox = ({ value, label, icon, type, ...props }) => (
  <label
    role="checkbox"
    className="custom-checkbox"
    style={{ padding: "0.25rem" }}
    aria-checked={props.isChecked}
  >
    <VisuallyHidden as="input" type="checkbox" value={value} {...props} />
    <Tooltip title={icon} placement="top" hasArrow={true}>
      <Image boxSize="3rem" ignoreFallback={true} src={getLocalIcon(icon, type)} alt={icon} />
    </Tooltip>
  </label>
);

const CheckBoxItems = ({ options, type, onChange, defaultValue }: ITraitInputProps) => (
  <CheckboxGroup
    defaultValue={defaultValue && defaultValue.map((o) => o.toString())}
    onChange={(v) => onChange(v.map((i) => Number(i)))}
  >
    <Stack isInline={true} spacing={3}>
      {options.map((o) => (
        <CustomCheckbox
          key={o.id}
          value={o.id.toString()}
          label={o.value}
          icon={o.name}
          type={type}
        />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default CheckBoxItems;
