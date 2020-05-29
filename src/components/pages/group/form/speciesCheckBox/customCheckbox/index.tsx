import { Divider, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { FormContextValues } from "react-hook-form";
import MultipleSpeciesSelector from "./multiple-categorical";
interface ISpeciesSelecProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  form: FormContextValues<any>;
}

const GroupSelector = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  form,
  ...props
}: ISpeciesSelecProps) => {
  const [species, setSpecies] = useState([]);
  const onChange = (id) => {
    setSpecies(id);
    form.setValue(name, [...id, ...species]);
  };

  // console.log("the species list is",options)

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <>
      <FormControl isInvalid={form.errors[name] && true} isRequired={true} mb={mb} {...props}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        {/* <CheckboxGroup id={name} value={value} onChange={onChange} isInline>
            {options.map((o) => (
              <SpeciesMultiSelectCheckbox key={o.id} value={o.id} icon={o.name} />
            ))}
          </CheckboxGroup> */}
        <MultipleSpeciesSelector values={options} defaultValue={[]} onUpdate={onChange} />
        <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
      <Divider mb={4} />
    </>
  );
};

export default GroupSelector;
