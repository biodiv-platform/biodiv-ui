import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Text,
  useDisclosure
} from "@chakra-ui/core";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import { TraitsValuePair } from "@interfaces/traits";
import { axGetTraitsByGroupId } from "@services/observation.service";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

import TraitInput from "../../../common/trait-input";

interface ITraitsPickerProps {
  name: string;
  label: string;
  form: UseFormMethods<Record<string, any>>;
}

const TraitsPicker = ({ name, form }: ITraitsPickerProps) => {
  const initialFacts = form.control.defaultValuesRef.current[name] || {};
  const [traitsPairs, setTraitsPairs] = useState<TraitsValuePair[]>([]);
  const [facts, setFacts] = useState<any>(initialFacts);
  const sGroup = form.watch("sGroup");
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    if (sGroup) {
      axGetTraitsByGroupId(sGroup).then(({ data }) => setTraitsPairs(data));
    }
  }, [sGroup]);

  const handleOnChange = (traitId, value) => {
    setFacts({ ...facts, [traitId]: Array.isArray(value) ? value : [value] });
  };

  useEffect(() => {
    form.setValue(name, facts);
  }, [facts]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <Box>
      <Button variant="link" color="gray.900" fontSize="2xl" mb={2} onClick={onToggle}>
        💎 {t("OBSERVATION.TRAITS")} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
      <Collapse in={isOpen}>
        {traitsPairs.map(({ traits, values }) => (
          <FormControl mb={4} key={traits.id}>
            <FormLabel mb={1}>{traits.name}</FormLabel>
            <TraitInput
              type={traits.traitTypes}
              values={values}
              onUpdate={(v) => handleOnChange(traits.id, v)}
            />
          </FormControl>
        ))}
        {!sGroup && <Text>please select group first</Text>}
      </Collapse>
      <Divider mb={3} />
    </Box>
  );
};

export default TraitsPicker;
