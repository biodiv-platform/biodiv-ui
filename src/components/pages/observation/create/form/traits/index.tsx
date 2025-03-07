import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import MultipleCategorialTrait from "@components/pages/observation/common/trait-input/multiple-categorical";
import { ColorEditSwatch } from "@components/pages/species/show/fields/traits/color/color-edit-swatch";
import { TraitsValuePair } from "@interfaces/traits";
import { axGetTraitsByGroupId } from "@services/observation.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { useFormContext } from "react-hook-form";

import TraitInput from "../../../common/trait-input";

interface ITraitsPickerProps {
  name: string;
  label: string;
  languageId;
}

const TraitsPicker = ({ name, languageId }: ITraitsPickerProps) => {
  const form = useFormContext();
  const initialFacts = form.control._defaultValues[name] || {};
  const [traitsPairs, setTraitsPairs] = useState<Required<TraitsValuePair>[]>([]);
  const [facts, setFacts] = useState<any>(initialFacts);
  const sGroup = form.watch("sGroup");
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<any>();

  useEffect(() => {
    if (sGroup) {
      axGetTraitsByGroupId(sGroup, languageId).then(({ data }) => setTraitsPairs(data));
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
      <Button variant="link" color="gray.900" fontSize="2xl" mb={2} onClick={onToggle}>
        💎 {t("observation:traits")} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
      <Collapse in={isOpen} unmountOnExit={true}>
        {traitsPairs.map(({ traits, values }) => (
          <FormControl mb={4} key={traits.id}>
            <FormLabel mb={1}>
              <LocalLink href={`/traits/show/${traits?.traitId}`} prefixGroup={true}>
                <BlueLink mr={2}>
                  {traits?.name} {traits?.units && `(${traits.units})`}
                </BlueLink>
              </LocalLink>
            </FormLabel>
            {traits.dataType == "STRING" && traits.traitTypes != "RANGE" && (
              <TraitInput
                type={traits.traitTypes}
                values={values}
                defaultValue={traits.traitId ? facts[traits.traitId] : undefined}
                onUpdate={(v) => handleOnChange(traits.traitId, v)}
              />
            )}
            {traits.dataType == "STRING" && traits.traitTypes == "RANGE" && (
              <MultipleCategorialTrait
                name={traits.name}
                type={traits.traitTypes}
                values={values}
                defaultValue={traits.traitId ? facts[traits.traitId] : undefined}
                onUpdate={(v) => handleOnChange(traits.traitId, v)}
                gridColumns={3}
              />
            )}
            {traits.dataType == "NUMERIC" && (
              <TraitInput
                type={traits.traitTypes}
                values={values}
                defaultValue={traits.traitId ? facts[traits.traitId] : undefined}
                onUpdate={(v) => handleOnChange(traits.traitId, v)}
              />
            )}
            {traits.dataType == "DATE" && (
              <Box mb={3} maxW="md">
                <InputGroup>
                  <DatePicker
                    ref={inputRef}
                    customInput={<Input />}
                    selected={
                      traits.traitId && facts[traits.traitId]
                        ? new Date(facts[traits.traitId][0].split(":")[0])
                        : null
                    }
                    startDate={
                      traits.traitId && facts[traits.traitId]
                        ? new Date(facts[traits.traitId][0].split(":")[0])
                        : null
                    }
                    endDate={
                      traits.traitId &&
                      facts[traits.traitId] &&
                      facts[traits.traitId][0].split(":").length > 1
                        ? new Date(facts[traits.traitId][0].split(":")[1])
                        : null
                    }
                    dateFormat={"dd-MM-yyyy"}
                    onChange={(v) => {
                      handleOnChange(traits.traitId, [
                        v
                          .filter((d) => d) // Filter out null or undefined values
                          .map((d) => d.toISOString().split("T")[0]) // Process remaining values
                          .join(":")
                      ]);
                    }}
                    selectsRange
                  />

                  <InputRightElement>
                    <label htmlFor={name} style={{ cursor: "pointer" }}>
                      <CalendarIcon color="gray.300" />
                    </label>
                  </InputRightElement>
                </InputGroup>
              </Box>
            )}
            {traits.dataType == "COLOR" && (
              <SimpleGrid columns={{ md: 3 }} spacing={4} mb={3}>
                {traits.traitId &&
                  facts[traits.traitId] &&
                  facts[traits.traitId].map((value, index) => (
                    <ColorEditSwatch
                      key={index}
                      index={index}
                      color={value}
                      onDelete={(index) =>
                        setFacts((prevFacts) => {
                          if (traits.traitId) {
                            const newValues = prevFacts[traits.traitId].filter(
                              (_, i) => i !== index
                            );

                            return {
                              ...prevFacts,
                              [traits.traitId]: newValues
                            };
                          }
                        })
                      }
                      onChange={(i, v) =>
                        setFacts((prevFacts) => {
                          if (traits.traitId) {
                            const existingFacts = prevFacts[traits.traitId];
                            existingFacts[i] = v;
                            return {
                              ...prevFacts,
                              [traits.traitId]: existingFacts
                            };
                          }
                        })
                      }
                    />
                  ))}
                <Button
                  h="3.25rem"
                  alignItems="center"
                  justifyContent="center"
                  onClick={() =>
                    setFacts((prevFacts) => {
                      if (traits.traitId) {
                        const existingFacts = prevFacts[traits.traitId] || [];
                        return {
                          ...prevFacts,
                          [traits.traitId]: [...existingFacts, "rgb(255,255,255"]
                        };
                      }
                    })
                  }
                >
                  {"Add"}
                </Button>
              </SimpleGrid>
            )}
          </FormControl>
        ))}
        {!sGroup && <Text>{t("observation:traits_no_group")}</Text>}
      </Collapse>
      <Divider mb={3} />
    </Box>
  );
};

export default TraitsPicker;
