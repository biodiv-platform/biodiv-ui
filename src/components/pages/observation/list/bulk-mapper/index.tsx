import {
  ActionBar,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Collapsible,
  Flex,
  HStack,
  Image,
  Portal,
  RadioCard,
  SimpleGrid,
  Spinner,
  Tabs,
  TabsContent,
  Text,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import { bulkObservationActionTabs } from "@static/observation-list";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuCircleCheck, LuRepeat } from "react-icons/lu";
import * as Yup from "yup";

import { useLocalRouter } from "@/components/@core/local-link";
import { SelectInputField } from "@/components/form/select";
import { SelectAsyncInputField } from "@/components/form/select-async";
import { Tooltip } from "@/components/ui/tooltip";
import useGlobalState from "@/hooks/use-global-state";
import CheckIcon from "@/icons/check";
import LockIcon from "@/icons/lock";
import UnlockIcon from "@/icons/unlock";
import { axGetObservationMapData } from "@/services/observation.service";
import { axGetLangList } from "@/services/utility.service";
import { getLocalIcon } from "@/utils/media";
import notification, { NotificationType } from "@/utils/notification";

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
import TraitsPost from "./actions/traitsTab";

export enum bulkActions {
  unPost = "ugBulkUnPosting",
  post = "ugBulkPosting",
  species = "speciesBulkPosting",
  reco = "recoBulkPosting"
}

export default function BulkMapperModal() {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const router = useLocalRouter();
  const {
    onClose,
    isOpen,
    onOpen,
    selectAll,
    handleBulkCheckbox,
    bulkObservationIds,
    observationData,
    bulkSpeciesIds,
    filter,
    excludedBulkIds
  } = useObservationFilter();
  const [tabIndex, setTabIndex] = useState<string | null>("common:usergroups");
  const { open: isContentVisible, onToggle: toggleContentVisibility } = useDisclosure({
    defaultOpen: false
  });
  useEffect(() => {
    if (bulkObservationIds && bulkObservationIds?.length > 0 && !isOpen) {
      onOpen();
    }
    if (bulkObservationIds && bulkObservationIds?.length == 0 && isOpen) {
      onClose();
    }
  }, [bulkObservationIds]);
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
  const { languageId } = useGlobalState();

  const idsWithValueGreaterThanZero = Object.entries(bulkSpeciesIds as Record<number, number>)
    .filter(([, value]) => value > 0)
    .map(([id]) => id);

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
  const handleOnValidate = async () => {
    const params = {
      ...filter,
      selectAll,
      view: "bulkMapping",
      bulkObservationIds: selectAll ? "" : bulkObservationIds?.toString(),
      bulkAction: "validateBulkObservations"
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

  const handleOnUnlock = async () => {
    const params = {
      ...filter,
      selectAll,
      view: "bulkMapping",
      bulkObservationIds: selectAll ? "" : bulkObservationIds?.toString(),
      bulkAction: "unlockBulkObservations"
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

  const handleOnSubmit = async (values) => {
    if (values.taxonCommonName || values.taxonScientificName) {
      const reco = {
        ...values,
        confidence: "CERTAIN",
        recoComment: ""
      };
      const params = {
        ...filter,
        selectAll,
        view: "bulkMapping",
        bulkRecoSuggestion: JSON.stringify(reco),
        bulkObservationIds: selectAll ? "" : bulkObservationIds?.toString(),
        bulkAction: bulkActions.reco
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
    } else {
      notification(t("observation:no_empty_suggestion"));
    }
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
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
            width="full"
            background={"#F0FDFA"}
            boxShadow={
              "0 -20px 60px rgba(0, 0, 0, 0.25), 0 -8px 20px rgba(0, 0, 0, 0.2), inset 0 3px 0 rgba(0, 0, 0, 0.2)"
            }
          >
            <Collapsible.Root width={"full"}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                width={"full"}
              >
                <Text fontWeight={"bold"} fontSize={"2xl"}>
                  {t("observation:bulk_actions")}
                </Text>
                <Box alignItems="end" ml="auto" justifyContent={"flex-end"}>
                  <ActionBar.SelectionTrigger m={2}>
                    {selectAll
                      ? observationData.n - (excludedBulkIds || []).length
                      : bulkObservationIds?.length}{" "}
                    {t("observation:bulk_actions_selected")}
                  </ActionBar.SelectionTrigger>
                  <ButtonGroup size="sm" variant="outline">
                    {!isSmall && (
                      <>
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
                        <Collapsible.Trigger>
                          <Button
                            onClick={toggleContentVisibility}
                            variant={"solid"}
                            colorPalette={"green"}
                          >
                            {isContentVisible ? "Hide actions" : "Show actions"}
                          </Button>
                        </Collapsible.Trigger>
                      </>
                    )}
                    <ActionBar.CloseTrigger asChild mr={4}>
                      <CloseButton size="sm" onClick={toggleContentVisibility} />
                    </ActionBar.CloseTrigger>
                  </ButtonGroup>
                </Box>
              </Box>
              <Box justifyContent="flex-start" width={"full"}>
                {isSmall && (
                  <ButtonGroup size="sm" variant="outline" mb={4}>
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
                    <Collapsible.Trigger>
                      <Button
                        onClick={toggleContentVisibility}
                        variant={"solid"}
                        colorPalette={"green"}
                      >
                        {isContentVisible ? "Hide actions" : "Show actions"}
                      </Button>
                    </Collapsible.Trigger>
                  </ButtonGroup>
                )}
                <Tabs.Root
                  lazyMount={true}
                  h={{ md: "100%" }}
                  className="tabs"
                  defaultValue={tabIndex}
                  onValueChange={(e) => setTabIndex(e.value)}
                  overflowY={"auto"}
                >
                  <Tabs.List minWidth={"600px"}>
                    {bulkObservationActionTabs.map(({ name, icon, active = true }) => (
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
                    <Collapsible.Content>
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
                                  colorPalette={"blue"}
                                  bg="white"
                                  _focus={{
                                    boxShadow: "outline"
                                  }}
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
                            <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
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
                              <HStack m={2} justifyContent="flex-end">
                                <SubmitButton leftIcon={<CheckIcon />}>
                                  {t("observation:suggest")}
                                </SubmitButton>
                              </HStack>
                            </form>
                          </FormProvider>
                        </Box>
                      </TabsContent>
                      <TabsContent
                        value="observation:traits"
                        height={"18rem"}
                        overflowY={"auto"}
                        p={4}
                      >
                        {
                          <TraitsPost
                            speciesId={idsWithValueGreaterThanZero}
                            languageId={languageId}
                            filter={filter}
                            selectAll={selectAll}
                            bulkObservationIds={bulkObservationIds}
                          />
                        }
                      </TabsContent>
                      <TabsContent
                        value="filters:data_quality.validation.title"
                        height={"18rem"}
                        overflowY={"auto"}
                        p={4}
                      >
                        <Box bg={"yellow.100"} p={2}>
                          {t("observation:bulk_action.validation_text")}
                        </Box>
                        <HStack m={2} justifyContent="flex-end">
                          <Button
                            size="sm"
                            variant="outline"
                            colorPalette="red"
                            aria-label="Save"
                            type="submit"
                            onClick={() => handleOnValidate()}
                          >
                            <LockIcon />
                            {t("observation:id.validate")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            colorPalette="blue"
                            aria-label="Save"
                            type="submit"
                            onClick={() => handleOnUnlock()}
                          >
                            <UnlockIcon />
                            {t("observation:id.unlock")}
                          </Button>
                        </HStack>
                      </TabsContent>
                    </Collapsible.Content>
                  </Box>
                </Tabs.Root>
              </Box>
            </Collapsible.Root>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
