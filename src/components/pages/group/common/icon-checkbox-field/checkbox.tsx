import { CheckboxGroup, Image, VisuallyHidden } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import { getLocalIcon } from "@utils/media";
import React from "react";

export interface ITraitInputProps {
  type?: string;
  values: any[];
  gridColumns?;
  onUpdate;
  defaultValue?;
}

const VH: any = VisuallyHidden;

const CustomCheckbox = ({ value, label, icon, type, ...props }) => (
  <label
    role="checkbox"
    className="custom-checkbox"
    style={{ padding: "0.25rem" }}
    aria-checked={props.isChecked}
  >
    <VH as="input" type="checkbox" {...props} value={value} />
    <Tooltip title={icon} placement="top" hasArrow={true}>
      <Image size="3rem" ignoreFallback={true} src={getLocalIcon(icon, type)} alt={icon} />
    </Tooltip>
  </label>
);

const CheckBoxItems = ({ values, type, onUpdate, defaultValue }: ITraitInputProps) => (
  <CheckboxGroup
    defaultValue={defaultValue && defaultValue.map((o) => o.toString())}
    onChange={(v) => onUpdate(v.map((i) => Number(i)))}
    isInline={true}
    spacing={3}
  >
    {values.map((o) => (
      <CustomCheckbox
        key={o.id}
        value={o.id.toString()}
        label={o.value}
        icon={o.name}
        type={type}
      />
    ))}
  </CheckboxGroup>
);

export default CheckBoxItems;
