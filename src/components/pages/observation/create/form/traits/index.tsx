import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { TraitsValuePair } from "@interfaces/traits";
import { axGetTraitsByGroupId } from "@services/observation.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import TraitInput from "../../../common/trait-input";

interface ITraitsPickerProps {
  name: string;
  label: string;
}

const TraitsPicker = ({ name }: ITraitsPickerProps) => {
  const form = useFormContext();
  const initialFacts = form.control._defaultValues[name] || {};
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
    form.register(name);
  }, [form.register]);

  return (
    <Box>
      <Button variant="link" color="gray.900" fontSize="2xl" mb={2} onClick={onToggle}>
        💎 {t("observation:traits")} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
      <Collapse in={isOpen}>
        {traitsPairs.map(
          ({ traits, values }) =>
            traits &&
            values && (
              <FormControl mb={4} key={traits.id}>
                <FormLabel mb={1}>{traits.name}</FormLabel>
                <TraitInput
                  type={traits.traitTypes}
                  values={values}
                  onUpdate={(v) => handleOnChange(traits.id, v)}
                />
              </FormControl>
            )
        )}
        {!sGroup && <Text>{t("observation:traits_no_group")}</Text>}
      </Collapse>
      <Divider mb={3} />
    </Box>
  );
};

export default TraitsPicker;
