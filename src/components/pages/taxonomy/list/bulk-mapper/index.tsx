import {
  ActionBar,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Collapsible,
  Heading,
  HStack,
  Portal,
  SimpleGrid,
  Table,
  Tabs,
  TabsContent,
  Text,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { SelectInputField } from "@/components/form/select";
import TaxonBreadcrumbs from "@/components/pages/common/breadcrumbs";
import Loading from "@/components/pages/common/loading";
import { Tooltip } from "@/components/ui/tooltip";
import CheckIcon from "@/icons/check";
import { axGetTaxonDetails, axTaxonomyBulkAction } from "@/services/taxonomy.service";
import { bulkActionTabs, TAXON_POSITION } from "@/static/taxon";
import notification, { NotificationType } from "@/utils/notification";
import { getInjectableHTML } from "@/utils/text";

import useTaxonFilter from "../use-taxon";

export default function BulkMapperModal() {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const { onClose, isOpen, onOpen, selectedTaxons } = useTaxonFilter();
  const [tabIndex, setTabIndex] = useState<string | null>("taxon:position.title");
  const [taxon, setTaxon] = useState<any>({});
  const [selectedRanks, setSelectedRanks] = useState<any []>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);
    axGetTaxonDetails(selectedTaxons[selectedTaxons.length-1]?.id)
      .then(({ data }) => {
        setTaxon(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching taxon:", error);
      });
  }, [selectedTaxons[0]]);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        position: Yup.string().required()
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
      bulkTaxonIds: selectedTaxons.map(item => item.id).join(','),
      selectAll: false
    };

    const { success } = await axTaxonomyBulkAction(params);

    if (success) {
      notification(t("taxon:bulk_action.success"), NotificationType.Success);
    } else {
      notification(t("taxon:bulk_action.failure"), NotificationType.Error);
    }
  };

  const mergeSubmit = async () => {
    const params = {
      bulkAction: "merge",
      bulkTaxonIds: selectedTaxons.map(item => item.id).join(','),
      selectAll: false
    };

    const { success } = await axTaxonomyBulkAction(params);

    if (success) {
      notification(t("taxon:bulk_action.success"), NotificationType.Success);
    } else {
      notification(t("taxon:bulk_action.failure"), NotificationType.Error);
    }
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
                      <TabsContent value="Merge" height={"14.5rem"}>
                        {!loading && (
                          <Box p={4} height={"10rem"} overflowY={"auto"}>
                            {selectedRanks && selectedRanks.length < 2
                              ? "This action will merge the selected taxon into the below taxon:"
                              : "Cannot merge the selected taxon as it contains taxon of different ranks."}
                            {selectedRanks && selectedRanks.length < 2 && (
                              <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mt={4}>
                                <Box gridColumn="1/3">
                                  <Heading as="h3" size="md" mb={4}>
                                    {t("common:information")}
                                  </Heading>
                                  <TaxonBreadcrumbs crumbs={taxon?.hierarchy} type="taxonomy" />
                                  <Table.Root borderRadius="lg" striped overflow="hidden">
                                    <Table.Body>
                                      <Table.Row>
                                        <Table.Cell
                                          title={t("taxon:modal.attributes.name.desc")}
                                          w="12rem"
                                        >
                                          {t("taxon:modal.attributes.name.title")}
                                        </Table.Cell>
                                        <Table.Cell>
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: getInjectableHTML(
                                                taxon?.taxonomyDefinition?.italicisedForm
                                              )
                                            }}
                                          />
                                        </Table.Cell>
                                      </Table.Row>
                                      <Table.Row>
                                        <Table.Cell
                                          title={t("taxon:modal.attributes.canonical.desc")}
                                        >
                                          {t("taxon:modal.attributes.canonical.title")}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {taxon?.taxonomyDefinition?.canonicalForm}
                                        </Table.Cell>
                                      </Table.Row>
                                      <Table.Row>
                                        <Table.Cell title={t("taxon:modal.attributes.author.desc")}>
                                          {t("taxon:modal.attributes.author.title")}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {taxon?.taxonomyDefinition?.authorYear}
                                        </Table.Cell>
                                      </Table.Row>
                                      <Table.Row>
                                        <Table.Cell title={t("taxon:modal.attributes.status.desc")}>
                                          {t("taxon:modal.attributes.status.title")}
                                        </Table.Cell>
                                        <Table.Cell>{taxon?.taxonomyDefinition?.status}</Table.Cell>
                                      </Table.Row>
                                      <Table.Row>
                                        <Table.Cell title={t("taxon:modal.attributes.rank.desc")}>
                                          {t("taxon:modal.attributes.rank.title")}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {t(`taxon:hierarchy.${taxon?.taxonomyDefinition?.rank}`)}
                                        </Table.Cell>
                                      </Table.Row>
                                      <Table.Row>
                                        <Table.Cell
                                          title={t("taxon:modal.attributes.position.desc")}
                                        >
                                          {t("taxon:modal.attributes.position.title")}
                                        </Table.Cell>
                                        <Table.Cell>
                                          {taxon?.taxonomyDefinition?.position}
                                        </Table.Cell>
                                      </Table.Row>
                                    </Table.Body>
                                  </Table.Root>
                                </Box>
                              </SimpleGrid>
                            )}
                          </Box>
                        )}
                        {loading && <Loading />}
                        {!loading && selectedRanks && selectedRanks.length < 2 && (
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
