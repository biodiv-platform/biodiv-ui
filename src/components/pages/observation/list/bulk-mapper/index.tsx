import {
  ActionBar,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Flex,
  HStack,
  Image,
  Input,
  Portal,
  RadioCard,
  SimpleGrid,
  Spinner,
  Tabs,
  TabsContent,
  Text
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { bulkActionTabs } from "@static/observation-list";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FormProvider, useForm } from "react-hook-form";
import { LuCalendar, LuCircleCheck, LuRepeat } from "react-icons/lu";
import * as Yup from "yup";

import BlueLink from "@/components/@core/blue-link";
import LocalLink, { useLocalRouter } from "@/components/@core/local-link";
import { SelectInputField } from "@/components/form/select";
import { SelectAsyncInputField } from "@/components/form/select-async";
import { ColorEditSwatch } from "@/components/pages/species/show/fields/traits/color/color-edit-swatch";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Tooltip } from "@/components/ui/tooltip";
import useGlobalState from "@/hooks/use-global-state";
import { TraitsValuePair } from "@/interfaces/traits";
import { axGetObservationMapData, axGetTraitsByGroupId } from "@/services/observation.service";
import { axGetLangList } from "@/services/utility.service";
import { getLocalIcon } from "@/utils/media";
import notification, { NotificationType } from "@/utils/notification";

import TraitInput from "../../common/trait-input";
import MultipleCategorialTrait from "../../common/trait-input/multiple-categorical";
import useObservationFilter from "../../common/use-observation-filter";
import {
  CommonNameOption,
  getCommonNameOption,
  onCommonNameQuery
} from "../../create/form/recodata/common-name";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "../../create/form/recodata/scientific-name";
import GroupPost from "./actions/groupTab";

export enum bulkActions {
  unPost = "ugBulkUnPosting",
  post = "ugBulkPosting",
  species = "speciesBulkPosting"
}

export default function BulkMapperModal() {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const {
    onClose,
    isOpen,
    selectAll,
    handleBulkCheckbox,
    bulkObservationIds,
    observationData,
    bulkSpeciesIds,
    filter
  } = useObservationFilter();
  const [tabIndex, setTabIndex] = useState<string | null>("common:usergroups");
  const handleSelectAll = () => {
    alert(`${observationData.n} ${t("observation:select_all_message")}`);
    handleBulkCheckbox("selectAll");
  };
  const speciesGroupList = useMemo(() => {
    return Object.keys(observationData?.ag?.groupSpeciesName || {}).sort(
      (a, b) => parseInt(a.split("|")[2] || "0", 10) - parseInt(b.split("|")[2] || "0", 10)
    );
  }, [observationData?.ag?.groupSpeciesName]);
  const [speciesGroupId, setSpeciesGroupId] = useState<string | null>(null);
  const [commonNameOptions, setCommonNameOptions] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  useEffect(() => {
    axGetLangList().then(({ data }) =>
      setLanguages(data.map((l) => ({ label: l.name, value: l.id })))
    );
  }, []);
  const inputRef = useRef<any>();

  const [traitPairs, setTraits] = useState<Required<TraitsValuePair>[]>();
  const { languageId } = useGlobalState();

  const idsWithValueGreaterThanZero = Object.entries(bulkSpeciesIds as Record<number, number>)
    .filter(([, value]) => value > 0)
    .map(([id]) => id);

  useEffect(() => {
    if (idsWithValueGreaterThanZero.length == 1) {
      axGetTraitsByGroupId(idsWithValueGreaterThanZero[0], languageId).then(({ data }) =>
        setTraits(data)
      );
    }
  }, [idsWithValueGreaterThanZero, languageId]);
  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        taxonCommonName: Yup.string().nullable(),
        scientificNameTaxonId: Yup.mixed().nullable(),
        taxonScientificName: Yup.string().nullable(),
        languageId: Yup.mixed().nullable()
      })
    ),
    defaultValues: {
      taxonCommonName: null,
      scientificNameTaxonId: null,
      taxonScientificName: null,
      languageId: 205
    }
  });
  const langRef: any = useRef(null);
  const scientificRef: any = useRef(null);
  const [facts, setFacts] = useState<any>({});
  const handleOnChange = (traitId, value) => {
    setFacts({ ...facts, [traitId]: Array.isArray(value) ? value : value ? [value] : [] });
  };

  const onCommonNameChange = ({ sLabel, sValue, lang, langId, groupId, updateScientific }) => {
    if (langId) {
      langRef.current.onChange(
        { value: langId, label: lang },
        { name: langRef.current.props.inputId }
      );
    }
    if ((sLabel || sValue) && updateScientific) {
      scientificRef.current.onChange(
        { value: sValue, label: sLabel, groupId },
        { name: scientificRef.current.props.inputId }
      );
    }
  };

  const handleOnSave = async (bulkAction) => {
    const params = {
      ...filter,
      selectAll,
      view: "bulkMapping",
      bulkSpeciesGroupId: speciesGroupId,
      bulkObservationIds: selectAll ? "" : bulkObservationIds?.toString(),
      bulkAction
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

    onClose();
  };

  const onScientificNameChange = ({ label, value, groupId, raw, source }) => {
    if (value === label) {
      hForm.setValue("scientificNameTaxonId", null);
    }
    hForm.setValue("taxonScientificName", label);
    if (groupId) {
      if (raw?.common_names) {
        setCommonNameOptions(raw.common_names.map((cn) => getCommonNameOption(cn, raw, false)));
      }
      hForm.setValue("sGroup", groupId);
    }
    hForm.setValue("source", source);
  };

  return (
    <ActionBar.Root open={isOpen} closeOnInteractOutside={false} onOpenChange={onClose}>
      <Portal>
        <ActionBar.Positioner
          css={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            zIndex: 1000
          }}
        >
          <ActionBar.Content
            css={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
            width="full"
            background={"linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)"}
            borderTop={"3px solid #e9ecef"}
            boxShadow={
              "0 -8px 32px rgba(0, 0, 0, 0.12), 0 -2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
            }
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
              width={"full"}
            >
              <Text fontWeight={"bold"} fontSize={"2xl"}>
                Bulk Actions
              </Text>
              <Box alignItems="end" ml="auto" justifyContent={"flex-end"}>
                <ActionBar.SelectionTrigger m={2}>
                  {selectAll ? observationData.n : bulkObservationIds?.length} selected
                </ActionBar.SelectionTrigger>
                <ButtonGroup size="sm" variant="outline">
                  {!selectAll && (
                    <Button variant="solid" colorPalette="blue" onClick={handleSelectAll}>
                      <LuCircleCheck />
                      {t("observation:select_all")}
                    </Button>
                  )}
                  <Button
                    variant="solid"
                    colorPalette="red"
                    onClick={() => handleBulkCheckbox("UnsSelectAll")}
                  >
                    <LuRepeat />
                    {t("observation:unselect")}
                  </Button>
                </ButtonGroup>
                <ActionBar.CloseTrigger asChild mr={6}>
                  <CloseButton size="sm" />
                </ActionBar.CloseTrigger>
              </Box>
            </Box>
            <Box justifyContent="flex-start" width={"full"}>
              <Tabs.Root
                lazyMount={true}
                h={{ md: "100%" }}
                // variant="unstyled"
                className="tabs"
                defaultValue={tabIndex}
                onValueChange={(e) => setTabIndex(e.value)}
              >
                <Tabs.List>
                  {bulkActionTabs.map(({ name, icon, active = true }) => (
                    <Tabs.Trigger key={name} data-hidden={!active} value={name}>
                      <Tooltip content={t(name)}>
                        <div>
                          {icon} <span>{t(name)}</span>
                        </div>
                      </Tooltip>
                    </Tabs.Trigger>
                  ))}
                  <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
                </Tabs.List>
                <Box position="relative">
                  <Tabs.Content value="common:usergroups">
                    <Suspense fallback={<Spinner />}>
                      <GroupPost />
                    </Suspense>
                  </Tabs.Content>
                  <TabsContent value="form:species_groups" width="100%">
                    <Suspense fallback={<Spinner />}>
                      <Box height="10rem" overflowX="clip" overflowY={"scroll"}>
                        <SimpleGrid columns={[1, 1, 2, 3]} gridGap={4}>
                          {speciesGroupList?.map((o) => (
                            <RadioCard.Root
                              cursor="pointer"
                              bg="white"
                              _checked={{
                                borderColor: "blue.500",
                                bg: "blue.50"
                              }}
                              _focus={{
                                boxShadow: "outline"
                              }}
                              style={undefined}
                              onValueChange={({ value }) => {
                                setSpeciesGroupId(value);
                              }}
                              size={"sm"}
                              value={speciesGroupId}
                            >
                              <RadioCard.Item value={o.split("|")[0]} key={o.split("|")[0]}>
                                <RadioCard.ItemHiddenInput />
                                <RadioCard.ItemControl>
                                  <RadioCard.ItemText>
                                    <Flex
                                      alignItems="center"
                                      h="2rem"
                                      overflow="hidden"
                                      title={o.split("|")[1]}
                                    >
                                      <Image
                                        loading="lazy"
                                        boxSize="2rem"
                                        mr={2}
                                        objectFit="contain"
                                        src={getLocalIcon(o.split("|")[1])}
                                        alt={o.split("|")[1]}
                                      />
                                      <Box className="elipsis-2">{o.split("|")[1]}</Box>
                                    </Flex>
                                  </RadioCard.ItemText>
                                </RadioCard.ItemControl>
                              </RadioCard.Item>
                            </RadioCard.Root>
                          ))}
                        </SimpleGrid>
                      </Box>
                      <HStack m={2} justifyContent="flex-end">
                        <Button
                          disabled={speciesGroupId == null}
                          size="sm"
                          variant="outline"
                          colorPalette="blue"
                          aria-label="Save"
                          type="submit"
                          onClick={() => handleOnSave(bulkActions.species)}
                        >
                          {"Save"}
                        </Button>
                      </HStack>
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="observation:id.title">
                    <Box p={4}>
                      <FormProvider {...hForm}>
                        <form>
                          <SimpleGrid columns={[1, 1, 3, 3]} gap={4}>
                            <SelectAsyncInputField
                              name="taxonCommonName"
                              label={t("observation:common_name")}
                              style={{ gridColumn: "1/3" }}
                              onQuery={onCommonNameQuery}
                              options={commonNameOptions}
                              optionComponent={CommonNameOption}
                              placeholder={t("form:min_three_chars")}
                              onChange={onCommonNameChange}
                            />
                            <SelectInputField
                              name="languageId"
                              label={t("form:language")}
                              options={languages}
                              selectRef={langRef}
                              shouldPortal={true}
                            />
                          </SimpleGrid>
                          <Box onMouseEnter={() => scientificRef.current.focus()}>
                            <SelectAsyncInputField
                              name="scientificNameTaxonId"
                              label={t("observation:scientific_name")}
                              onQuery={onScientificNameQuery}
                              optionComponent={ScientificNameOption}
                              placeholder={t("form:min_three_chars")}
                              onChange={onScientificNameChange}
                              options={[]}
                              selectRef={scientificRef}
                              openMenuOnFocus={true}
                            />
                          </Box>
                        </form>
                      </FormProvider>
                    </Box>
                  </TabsContent>
                  <TabsContent value="observation:traits" height={"18rem"} overflowY={"auto"} p={4}>
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
                              traits.traitId
                                ? facts[traits.traitId + "|" + traits.dataType]
                                : undefined
                            }
                            onUpdate={(v) =>
                              handleOnChange(traits.traitId + "|" + traits.dataType, v)
                            }
                            gridColumns={3}
                          />
                        )}
                        {traits.dataType == "STRING" && traits.traitTypes != "RANGE" && (
                          <TraitInput
                            type={traits.traitTypes}
                            values={values}
                            defaultValue={
                              traits.traitId
                                ? facts[traits.traitId + "|" + traits.dataType]
                                : undefined
                            }
                            onUpdate={(v) =>
                              handleOnChange(traits.traitId + "|" + traits.dataType, v)
                            }
                          />
                        )}
                        {traits.dataType == "NUMERIC" && (
                          <TraitInput
                            type={traits.traitTypes}
                            values={values}
                            defaultValue={
                              traits.traitId
                                ? facts[traits.traitId + "|" + traits.dataType]
                                : undefined
                            }
                            onUpdate={(v) =>
                              handleOnChange(traits.traitId + "|" + traits.dataType, v)
                            }
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
                                    ? new Date(
                                        facts[traits.traitId + "|" + traits.dataType][0].split(
                                          ":"
                                        )[0]
                                      )
                                    : null
                                }
                                startDate={
                                  traits.traitId && facts[traits.traitId + "|" + traits.dataType]
                                    ? new Date(
                                        facts[traits.traitId + "|" + traits.dataType][0].split(
                                          ":"
                                        )[0]
                                      )
                                    : null
                                }
                                endDate={
                                  traits.traitId &&
                                  facts[traits.traitId + "|" + traits.dataType] &&
                                  facts[traits.traitId + "|" + traits.dataType][0].split(":")
                                    .length > 1
                                    ? new Date(
                                        facts[traits.traitId + "|" + traits.dataType][0].split(
                                          ":"
                                        )[1]
                                      )
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
                                        const existingFacts =
                                          prevFacts[traits.traitId + "|" + traits.dataType];
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
                                    const existingFacts =
                                      prevFacts[traits.traitId + "|" + traits.dataType] || [];
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
                              {"Add"}
                            </Button>
                          </SimpleGrid>
                        )}
                      </Field>
                    ))}
                  </TabsContent>
                </Box>
              </Tabs.Root>
            </Box>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
