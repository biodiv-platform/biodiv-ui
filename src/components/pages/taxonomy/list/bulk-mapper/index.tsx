import {
  ActionBar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Collapsible,
  Flex,
  Heading,
  HStack,
  Portal,
  Tabs,
  TabsContent,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { SelectInputField } from "@/components/form/select";
import { SelectAsyncInputField } from "@/components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@/components/pages/observation/create/form/recodata/scientific-name";
import { Tooltip } from "@/components/ui/tooltip";
import CheckIcon from "@/icons/check";
import { axTaxonomyBulkAction } from "@/services/taxonomy.service";
import { TAXON_BADGE_COLORS } from "@/static/constants";
import { bulkActionTabs, TAXON_POSITION } from "@/static/taxon";
import notification, { NotificationType } from "@/utils/notification";

import useTaxonFilter from "../use-taxon";

export default function BulkMapperModal() {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const { onClose, isOpen, onOpen, selectedTaxons } = useTaxonFilter();
  const [tabIndex, setTabIndex] = useState<string | null>("taxon:position.title");
  const [selectedRanks, setSelectedRanks] = useState<any[]>([]);
  const { open: isContentVisible, onToggle: toggleContentVisibility } = useDisclosure({
    defaultOpen: false
  });
  useEffect(() => {
    if (selectedTaxons && selectedTaxons?.length > 0 && !isOpen) {
      onOpen();
    }
    if (selectedTaxons && selectedTaxons?.length == 0 && isOpen) {
      onClose();
    }
    const distinctRanks = [...new Set(selectedTaxons.map((item) => item.rank))];
    setSelectedRanks(distinctRanks);
  }, [selectedTaxons]);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        position: Yup.string(),
        newTaxonId: Yup.number()
          .transform((_, val) => {
            // val comes in as an array of option objects from SelectAsync
            if (Array.isArray(val)) return Number(val[0]?.value);
            if (typeof val === "object") return Number(val?.value);
            return Number(val);
          })
          .typeError("Please select a taxon")
      })
    ),
    defaultValues: {
      position: "RAW"
    }
  });
  const langRef: any = useRef(null);

  const handleOnSubmit = async (values) => {
    const params = {
      bulkPosition: values.position,
      bulkAction: "position",
      bulkTaxonIds: selectedTaxons.map((item) => item.id).join(","),
      selectAll: false
    };

    const { success } = await axTaxonomyBulkAction(params);

    if (success) {
      notification(t("taxon:bulk_action.success"), NotificationType.Success);
    } else {
      notification(t("taxon:bulk_action.failure"), NotificationType.Error);
    }
    onClose();
  };

  const mergeSubmit = hForm.handleSubmit(async (values) => {
    const newTaxonId = values.newTaxonId; // Yup transform runs here, gives you a number

    if (!newTaxonId) {
      notification(t("taxon:bulk_action.select_taxon"), NotificationType.Error);
      return;
    }

    const selectedIds = selectedTaxons.map((item) => item.id);
    const mergedIds = [newTaxonId, ...selectedIds].join(",");

    const params = {
      bulkAction: "merge",
      bulkTaxonIds: mergedIds,
      selectAll: false
    };

    const { success } = await axTaxonomyBulkAction(params);

    if (success) {
      notification(t("taxon:bulk_action.success"), NotificationType.Success);
    } else {
      notification(t("taxon:bulk_action.failure"), NotificationType.Error);
    }
    onClose();
  });

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
                  {t("taxon:bulk_actions")}
                </Text>
                <Box alignItems="end" ml="auto" justifyContent={"flex-end"}>
                  <ActionBar.SelectionTrigger m={2}>
                    {selectedTaxons?.length} {t("taxon:bulk_actions_selected")}
                  </ActionBar.SelectionTrigger>
                  <ButtonGroup size="sm" variant="outline">
                    {!isSmall && (
                      <>
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
                >
                  <Tabs.List minWidth={"600px"}>
                    {bulkActionTabs.map(({ name, icon }) => (
                      <Tabs.Trigger key={name} value={name}>
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
                      <TabsContent value="taxon:position.title" height={"14.5rem"}>
                        <Box p={4}>
                          <FormProvider {...hForm}>
                            <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                              <Box onMouseEnter={() => langRef.current.focus()}>
                                <SelectInputField
                                  name="position"
                                  label={t("taxon:modal.attributes.position.title")}
                                  options={TAXON_POSITION}
                                  selectRef={langRef}
                                  shouldPortal={true}
                                />
                              </Box>
                              <HStack m={2} justifyContent="flex-end">
                                <SubmitButton leftIcon={<CheckIcon />}>
                                  {t("common:save")}
                                </SubmitButton>
                              </HStack>
                            </form>
                          </FormProvider>
                        </Box>
                      </TabsContent>
                      <TabsContent value="Merge" height={"19.5rem"}>
                        {
                          <Box p={4} height={"15rem"} overflowY={"auto"}>
                            {selectedRanks && selectedRanks.length < 2 && (
                              <Box display="grid" gridTemplateColumns="1fr auto 1fr" gap={0}>
                                <Box>
                                  <Heading as="h3" size="md" mb={4}>
                                    Selected Taxa
                                  </Heading>
                                  <VStack gap={1.5} align="stretch">
                                    {selectedTaxons.map((t) => (
                                      <Box
                                        key={t.id}
                                        //align="center"
                                        gap={2}
                                        px={3}
                                        py={1.5}
                                        bg="gray.50"
                                        borderWidth="0.5px"
                                        borderColor="gray.200"
                                        borderRadius="md"
                                      >
                                        {t.name + " (" + t.id + ")"}
                                        {t.rank && <Badge>{t.rank}</Badge>}
                                        {t.status && (
                                          <Badge colorPalette={TAXON_BADGE_COLORS[t.status]}>
                                            {t.status}
                                          </Badge>
                                        )}
                                        {t.position && (
                                          <Badge colorPalette={TAXON_BADGE_COLORS[t.position]}>
                                            {t.position}
                                          </Badge>
                                        )}
                                      </Box>
                                    ))}
                                  </VStack>
                                </Box>
                                <Flex direction="column" align="center" justify="center" px={3}>
                                  <Box
                                    w="1px"
                                    flex={1}
                                    bgGradient="to-b"
                                    gradientFrom="transparent"
                                    gradientTo="teal.400"
                                  />
                                  <Box
                                    w={7}
                                    h={7}
                                    borderRadius="full"
                                    bg="teal.50"
                                    border="1.5px solid"
                                    borderColor="teal.400"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    flexShrink={0}
                                    my={1}
                                  >
                                    <Text fontSize="14px" color="teal.600">
                                      →
                                    </Text>
                                  </Box>
                                  <Box
                                    w="1px"
                                    flex={1}
                                    bgGradient="to-b"
                                    gradientFrom="teal.400"
                                    gradientTo="transparent"
                                  />
                                </Flex>
                                <Box>
                                  <Heading as="h3" size="md" mb={4}>
                                    Merge To
                                  </Heading>
                                  <FormProvider {...hForm}>
                                    <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                                      <Box>
                                        <SelectAsyncInputField
                                          name="newTaxonId"
                                          label={t("form:accepted_name")}
                                          multiple={true}
                                          onQuery={(q) => onScientificNameQuery(q)}
                                          optionComponent={ScientificNameOption}
                                          placeholder={t("form:min_three_chars")}
                                          isRaw={true}
                                          portalled={false}
                                        />
                                      </Box>
                                    </form>
                                  </FormProvider>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        }
                        {selectedRanks && selectedRanks.length < 2 && (
                          <HStack m={2} justifyContent="flex-end">
                            <Button onClick={mergeSubmit}>{t("common:save")}</Button>
                          </HStack>
                        )}
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
