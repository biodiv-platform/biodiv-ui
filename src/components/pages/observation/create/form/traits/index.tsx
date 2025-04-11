import { Box, Button, Collapsible, Separator, Text, useDisclosure } from "@chakra-ui/react";
import { TraitsValuePair } from "@interfaces/traits";
import { axGetTraitsByGroupId } from "@services/observation.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import { Field } from "@/components/ui/field";

import TraitInput from "../../../common/trait-input";

interface ITraitsPickerProps {
  name: string;
  label: string;
}

const TraitsPicker = ({ name }: ITraitsPickerProps) => {
  const form = useFormContext();
  const initialFacts = form.control._defaultValues[name] || {};
  const [traitsPairs, setTraitsPairs] = useState<Required<TraitsValuePair>[]>([]);
  const [facts, setFacts] = useState<any>(initialFacts);
  const sGroup = form.watch("sGroup");
  const { t } = useTranslation();
  const { open, onToggle } = useDisclosure();

  useEffect(() => {
    if (sGroup) {
      axGetTraitsByGroupId(sGroup).then(({ data }) => setTraitsPairs(data));
    }
  }, [sGroup]);

  const handleOnChange = (traitId, value) => {
    setFacts({ ...facts, [traitId]: Array.isArray(value) ? value : value ? [value] : [] });
  };

  useEffect(() => {
    form.setValue(name, facts);
  }, [facts]);

  useEffect(() => {
    form.register(name);
  }, [form.register]);

  return (
    <Box>
      <Button variant="ghost" color="gray.900" fontSize="2xl" mb={2} onClick={onToggle}>
        💎 {t("observation:traits")} {open ? <LuChevronUp /> : <LuChevronDown />}
      </Button>
      <Collapsible.Root open={open} unmountOnExit={true}>
        <Collapsible.Content>
          {traitsPairs.map(({ traits, values }) => (
            <Field mb={4} key={traits.id} label={traits.name}>
              <TraitInput
                type={traits.traitTypes}
                values={values}
                defaultValue={traits.id ? facts[traits.id] : undefined}
                onUpdate={(v) => handleOnChange(traits.id, v)}
              />
            </Field>
          ))}
          {!sGroup && <Text>{t("observation:traits_no_group")}</Text>}
        </Collapsible.Content>
      </Collapsible.Root>
      <Separator mb={3} />
    </Box>
  );
};

export default TraitsPicker;
