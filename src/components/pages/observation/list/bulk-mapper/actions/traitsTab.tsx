import { Box, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import LocalLink, { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { LuCalendar } from "react-icons/lu";

import BlueLink from "@/components/@core/blue-link";
import { ColorEditSwatch } from "@/components/pages/species/show/fields/traits/color/color-edit-swatch";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { TraitsValuePair } from "@/interfaces/traits";
import { axGetObservationMapData, axGetTraitsByGroupId } from "@/services/observation.service";
import { axGetRootTraits } from "@/services/traits.service";
import notification, { NotificationType } from "@/utils/notification";
import { cleanFacts } from "@/utils/tags";

import TraitInput from "../../../common/trait-input";
import MultipleCategorialTrait from "../../../common/trait-input/multiple-categorical";

export default function TraitsPost({
  speciesId,
  languageId,
  filter,
  selectAll,
  bulkObservationIds
}) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const [traitPairs, setTraits] = useState<Required<TraitsValuePair>[]>();
  const [speciesIds, setSpeciesIds] = useState([]);
  const inputRef = useRef<any>();
  useEffect(() => {
    if (JSON.stringify(speciesId) !== JSON.stringify(speciesIds)) {
      if (speciesId.length == 1) {
        axGetTraitsByGroupId(speciesId[0], languageId).then(({ data }) => setTraits(data));
      } else {
        axGetRootTraits(languageId).then(({ data }) => setTraits(data));
      }
      setSpeciesIds(speciesId);
    }
  }, [speciesId, languageId]);
  const [facts, setFacts] = useState<any>({});
  const handleOnChange = (traitId, value) => {
    setFacts({ ...facts, [traitId]: Array.isArray(value) ? value : value ? [value] : [] });
  };
  const handleOnTraitSave = async () => {
    const cleFacts = cleanFacts(facts);
    const result = Object.entries(cleFacts.factValuePairs)
      .map(([key, values]) => {
        // Join array values with commas
        const valueString = values.join(",");
        return `${key}:${valueString}`;
      })
      .filter((part) => part.includes(":")) // Remove empty entries
      .join("|");

    const params = {
      ...filter,
      selectAll,
      view: "bulkMapping",
      bulkTraits: result,
      bulkObservationIds: selectAll ? "" : bulkObservationIds?.toString(),
      bulkAction: "traitsBulkPosting"
    };

    const { success } = await axGetObservationMapData(
      params,
      filter?.location ? { location: filter.location } : {},
      true
    );

    if (success) {
      notification(t("observation:bulk_action.success"), NotificationType.Success);
    } else {
      notification(t("observation:bulk_action.failure"), NotificationType.Error);
    }
    router.push("/observation/list", true, { ...filter }, true);
  };
  return (
    <Box>
      {traitPairs?.map(({ traits, values }) => (
        <Field mb={4} key={traits.id}>
          <Field mb={1}>
            <BlueLink mr={2} asChild>
              <LocalLink href={`/traits/show/${traits?.traitId}`} prefixGroup={true}>
                {traits?.name} {traits?.units && `(${traits.units})`}
              </LocalLink>
            </BlueLink>
          </Field>
          {traits.dataType == "STRING" && traits.traitTypes == "RANGE" && (
            <MultipleCategorialTrait
              name={traits.name}
              type={traits.traitTypes}
              values={values}
              defaultValue={
                traits.traitId ? facts[traits.traitId + "|" + traits.dataType] : undefined
              }
              onUpdate={(v) => handleOnChange(traits.traitId + "|" + traits.dataType, v)}
              gridColumns={3}
            />
          )}
          {traits.dataType == "STRING" && traits.traitTypes != "RANGE" && (
            <TraitInput
              type={traits.traitTypes}
              values={values}
              defaultValue={
                traits.traitId ? facts[traits.traitId + "|" + traits.dataType] : undefined
              }
              onUpdate={(v) => handleOnChange(traits.traitId + "|" + traits.dataType, v)}
            />
          )}
          {traits.dataType == "NUMERIC" && (
            <TraitInput
              type={traits.traitTypes}
              values={values}
              defaultValue={
                traits.traitId ? facts[traits.traitId + "|" + traits.dataType] : undefined
              }
              onUpdate={(v) => handleOnChange(traits.traitId + "|" + traits.dataType, v)}
            />
          )}
          {traits.dataType == "DATE" && (
            <Box mb={3} maxW="md">
              <InputGroup
                endElement={
                  <label htmlFor={""} style={{ cursor: "pointer" }}>
                    <LuCalendar color="gray.300" />
                  </label>
                }
              >
                <DatePicker
                  ref={inputRef}
                  customInput={<Input />}
                  selected={
                    traits.traitId && facts[traits.traitId + "|" + traits.dataType]
                      ? new Date(facts[traits.traitId + "|" + traits.dataType][0].split(":")[0])
                      : null
                  }
                  startDate={
                    traits.traitId && facts[traits.traitId + "|" + traits.dataType]
                      ? new Date(facts[traits.traitId + "|" + traits.dataType][0].split(":")[0])
                      : null
                  }
                  endDate={
                    traits.traitId &&
                    facts[traits.traitId + "|" + traits.dataType] &&
                    facts[traits.traitId + "|" + traits.dataType][0].split(":").length > 1
                      ? new Date(facts[traits.traitId + "|" + traits.dataType][0].split(":")[1])
                      : null
                  }
                  dateFormat={"dd-MM-yyyy"}
                  onChange={(v) => {
                    handleOnChange(traits.traitId + "|" + traits.dataType, [
                      v
                        .filter((d) => d) // Filter out null or undefined values
                        .map((d) => d.toISOString().split("T")[0]) // Process remaining values
                        .join(":")
                    ]);
                  }}
                  selectsRange
                />
              </InputGroup>
            </Box>
          )}
          {traits.dataType == "COLOR" && (
            <SimpleGrid columns={{ md: 3 }} gap={4} mb={3}>
              {traits.traitId &&
                facts[traits.traitId + "|" + traits.dataType] &&
                facts[traits.traitId + "|" + traits.dataType].map((value, index) => (
                  <ColorEditSwatch
                    key={index}
                    index={index}
                    color={value}
                    onDelete={(index) =>
                      setFacts((prevFacts) => {
                        if (traits.traitId) {
                          const newValues = prevFacts[
                            traits.traitId + "|" + traits.dataType
                          ].filter((_, i) => i !== index);

                          return {
                            ...prevFacts,
                            [traits.traitId + "|" + traits.dataType]: newValues
                          };
                        }
                      })
                    }
                    onChange={(i, v) =>
                      setFacts((prevFacts) => {
                        if (traits.traitId) {
                          const existingFacts = prevFacts[traits.traitId + "|" + traits.dataType];
                          existingFacts[i] = v;
                          return {
                            ...prevFacts,
                            [traits.traitId + "|" + traits.dataType]: existingFacts
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
                      const existingFacts = prevFacts[traits.traitId + "|" + traits.dataType] || [];
                      return {
                        ...prevFacts,
                        [traits.traitId + "|" + traits.dataType]: [
                          ...existingFacts,
                          "rgb(255,255,255"
                        ]
                      };
                    }
                  })
                }
              >
                {t("traits:add")}
              </Button>
            </SimpleGrid>
          )}
        </Field>
      ))}
      <HStack m={2} justifyContent="flex-end">
        <Button
          size="sm"
          variant="outline"
          colorPalette="blue"
          aria-label="Save"
          type="submit"
          onClick={() => handleOnTraitSave()}
        >
          {t("traits:save")}
        </Button>
      </HStack>
    </Box>
  );
}
