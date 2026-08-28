import {
  Badge,
  Box,
  Button,
  FileUpload,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  Tooltip,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Collapsible } from "@chakra-ui/react";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import { REQUIRED_COLUMNS, TAXON_BADGE_COLORS } from "@static/constants";
import notification, { NotificationType } from "@utils/notification";
import ExcelJS from "exceljs";
import useTranslation from "next-translate/useTranslation";
import { Fragment, useCallback, useState } from "react";
import { LuChevronDown, LuChevronRight, LuRepeat, LuTag } from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { axBatchUpload, axUploadBatchFile } from "@/services/taxonomy.service";

import ColumnMapper from "../../traits/common/column-mapper";

const ACCEPT_STRING =
  "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function SubRowGroup({ label, icon, items }: { label: string; icon: any; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Collapsible.Trigger asChild>
        <HStack gap={1} fontSize="xs" color="blue.600" cursor="pointer" mt={1}>
          <Icon as={icon} boxSize={3} />
          <Text>
            {label} ({items.length})
          </Text>
          <Icon
            as={LuChevronDown}
            boxSize={3}
            transform={open ? "rotate(180deg)" : "rotate(0deg)"}
            transition="transform 0.15s"
          />
        </HStack>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <VStack align="stretch" gap={0} mt={2} borderLeft="2px solid" borderColor="gray.200" pl={2}>
          {items.map((it, i) => (
            <HStack key={i} justify="space-between" py={1} fontSize="xs">
              <Text color="gray.600">{it.split("|")[0]}</Text>
              <Text color={it.split("|")[1] == "null" ? "green.600" : "gray.600"}>
                {it.split("|")[1] == "null" ? "CREATE" : "NOOP"}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default function TaxonomyBatchUploadComponent() {
  const [uploadResult, setUploadResult] = useState<string[]>([]);
  const getCreationCounts = useCallback(() => {
    let namesCount = 0;
    let synonymsCount = 0;
    let commonNamesCount = 0;

    uploadResult.forEach((item: any) => {
      if (item["action"] === "CREATE") {
        namesCount++;
      }

      if (item["synonyms"]) {
        synonymsCount += item["synonyms"].filter(
          (syn: string) => syn.split("|")[1] === "null"
        ).length;
      }

      if (item["commonNames"]) {
        commonNamesCount += item["commonNames"].filter(
          (cn: string) => cn.split("|")[1] === "null"
        ).length;
      }
    });

    return { namesCount, synonymsCount, commonNamesCount };
  }, [uploadResult]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [columnMapping, setColumnMapping] = useState<[number, string][]>([]);
  const [headersMapping, setHeadersMapping] = useState<string[]>([]);
  const { open: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CREATE":
        return "green.700";
      case "UPDATE":
        return "orange.700"; // Chakra uses "orange" not "amber"
      case "NOOP":
        return "gray.600";
      case "ERROR":
        return "red.700";
      default:
        return "gray.600";
    }
  };

  const options = [
    "ScientificName",
    "TaxonConceptId",
    "SpeciesId",
    "MatchedStatus",
    "MatchedPosition",
    "Hierarchy",
    "Status",
    "Position",
    "Contributor",
    "Rank"
  ];
  const { t } = useTranslation();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const targetFile = details.acceptedFiles[0];

      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification(t("traits:trait_matching.excel_file_error"));
        return;
      }

      if (targetFile) {
        setFile(targetFile);
        try {
          const workbook = new ExcelJS.Workbook();
          const arrayBuffer = await targetFile.arrayBuffer();
          await workbook.xlsx.load(arrayBuffer);

          const worksheet = workbook.worksheets[0];
          const firstRow = worksheet.getRow(1);
          const extractedHeaders: string[] = [];

          firstRow.eachCell((cell, colNumber) => {
            if (cell.value) {
              const cellValue = cell.value.toString();
              extractedHeaders.push(`${cellValue}|${colNumber - 1}`);
              if (options.some((option) => option.toLowerCase() === cellValue.toLowerCase())) {
                setColumnMapping((prev) => {
                  const updatedOptions = [...prev];
                  const existingIndex = updatedOptions.findIndex(([i]) => i === colNumber - 1);

                  if (existingIndex !== -1) {
                    updatedOptions[existingIndex] = [colNumber - 1, cellValue];
                  } else {
                    updatedOptions.push([colNumber - 1, cellValue]);
                  }
                  return updatedOptions;
                });
              }
            }
          });
          setHeadersMapping(extractedHeaders);
          onOpen1();
        } catch (error) {
          console.error(t("traits:trait_matching.excel_file_error"), error);
        }
      } else {
        alert(t("traits:trait_matching.no_file_error"));
      }
    },
    [onOpen1, t]
  );

  const columnMappingSubmit = async () => {
    if (REQUIRED_COLUMNS.some((col) => !columnMapping.some(([, i]) => i === col))) {
      notification("Please map ScientificName, TaxonConceptId, SpeciesId and Contributor");
    } else {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      formData.append(
        "scientificName",
        columnMapping.filter(([, i]) => i === "ScientificName")[0][0].toString()
      );

      formData.append(
        "TaxonConceptId",
        columnMapping.filter(([, i]) => i === "TaxonConceptId")[0][0].toString()
      );

      formData.append(
        "SpeciesId",
        columnMapping.filter(([, i]) => i === "SpeciesId")[0][0].toString()
      );

      if (columnMapping.filter(([, i]) => i === "MatchedStatus").length > 0) {
        formData.append(
          "MatchedStatus",
          columnMapping.filter(([, i]) => i === "MatchedStatus")[0][0].toString()
        );
      }

      if (columnMapping.filter(([, i]) => i === "MatchedPosition").length > 0) {
        formData.append(
          "MatchedPosition",
          columnMapping.filter(([, i]) => i === "MatchedPosition")[0][0].toString()
        );
      }

      if (columnMapping.filter(([, i]) => i === "Hierarchy").length > 0) {
        formData.append(
          "Hierarchy",
          columnMapping.filter(([, i]) => i === "Hierarchy")[0][0].toString()
        );
      }

      if (columnMapping.filter(([, i]) => i === "Status").length > 0) {
        formData.append("Status", columnMapping.filter(([, i]) => i === "Status")[0][0].toString());
      }

      if (columnMapping.filter(([, i]) => i === "Position").length > 0) {
        formData.append(
          "Position",
          columnMapping.filter(([, i]) => i === "Position")[0][0].toString()
        );
      }

      if (columnMapping.filter(([, i]) => i === "Rank").length > 0) {
        formData.append("Rank", columnMapping.filter(([, i]) => i === "Rank")[0][0].toString());
      }

      const { success, data } = await axUploadBatchFile(formData);
      onClose1();
      if (success) {
        setUploadResult(data);
        setCurrentStep(2);
      }
    }
  };

  const buildAcceptedPayload = useCallback(() => {
    return uploadResult
      .filter((item: any) => item["action"] === "CREATE" || item["action"] === "NOOP" || item["action"] === "UPDATE")
      .map((item: any) => ({
        scientificName: item["scientificName"],
        status: item["status"],
        position: item["position"],
        hierarchy: item["hierarchy"],
        synonyms: (item["synonyms"] || [])
          .filter((syn: string) => syn.split("|")[1] === "null")
          .map((syn: string) => syn),
        commonNames: (item["commonNames"] || [])
          .filter((cn: string) => cn.split("|")[1] === "null")
          .map((cn: string) => cn),
        taxonId: item["taxonId"]
      }));
  }, [uploadResult]);

  async function handleSubmit() {
    const payload = buildAcceptedPayload();

    try {
      const { success } = await axBatchUpload(payload);
      if (success) {
        notification("Taxonomy created successfully", NotificationType.Success);
        // e.g. reset state, move to a final step, or navigate away
        setCurrentStep(1);
        setUploadResult([]);
        setFile(null);
        setColumnMapping([]);
        setHeadersMapping([]);
      } else {
        notification("Error while creating taxonomy");
      }
    } catch (error) {
      notification("Error while creating taxonomy");
    }
  }

  return (
    <Box p={4}>
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        {t("traits:trait_matching.description")}
      </Alert>
      {currentStep == 1 && (
        <FileUpload.Root
          accept={ACCEPT_STRING}
          onFileChange={handleFileChange}
          maxFiles={1}
          width="full"
        >
          <FileUpload.HiddenInput />

          <FileUpload.Context>
            {(fileUpload) => (
              <FileUpload.Dropzone
                asChild
                border="none"
                p={0}
                minH="calc(100vh - var(--heading-height))"
                id="dropzone"
                cursor="inherit"
                width="full"
              >
                <Box bg={fileUpload.dragging ? "blue.100" : undefined} width="full" height="full">
                  <Flex
                    minH="calc(100vh - var(--heading-height))"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Flex flexDir="column" alignItems="center" p={4}>
                      <UploadIcon size={100} />
                      <Heading size="lg" fontWeight="normal" color="gray.400" mt={8}>
                        {t("traits:trait_matching.browse_description")}
                      </Heading>
                      <Button
                        colorPalette="blue"
                        onClick={() => fileUpload.openFilePicker()}
                        mb={8}
                      >
                        {t("traits:trait_matching.browse_button")}
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              </FileUpload.Dropzone>
            )}
          </FileUpload.Context>
        </FileUpload.Root>
      )}

      <ColumnMapper
        options={options}
        manyOptions={[]}
        isOpen={isOpen1}
        onClose={onClose1}
        description={t("traits:trait_matching.column_mapping_description")}
        headers={headersMapping}
        columnMapping={columnMapping}
        setColumnMapping={setColumnMapping}
        onSubmit={columnMappingSubmit}
        optionDisabled={columnMapping.filter(([, i]) => i === "TaxonConceptId").length == 0}
      />

      {currentStep == 2 && (
        <>
          <Box mb={4}>
            <Box mb={4} width="100%">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    {<th>{t("taxon:name_matching.species_name")}</th>}
                    {<th>Status</th>}
                    {<th>Position</th>}
                    {<th>Hierarchy</th>}
                    {<th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {uploadResult &&
                    uploadResult.map((item, index) => (
                      <tr style={{ borderWidth: "2px" }} key={index}>
                        <td>
                          <Box m={2}>
                            {item["scientificName"]}
                            {item["speciesId"] != null && (
                              <Box mt={2}>
                                <Text color={"blue.700"} fontWeight={"bold"}>
                                  {t("taxon:name_matching.species_page_exist")}
                                </Text>
                              </Box>
                            )}
                            {item["synonyms"] && item["synonyms"].length > 0 && (
                              <SubRowGroup
                                label="Synonyms"
                                icon={LuRepeat}
                                items={item["synonyms"]}
                              />
                            )}
                            {item["commonNames"] && item["commonNames"].length > 0 && (
                              <SubRowGroup
                                label="Common names"
                                icon={LuTag}
                                items={item["commonNames"]}
                              />
                            )}
                          </Box>
                        </td>
                        <td>
                          <Badge ml={2} colorPalette={TAXON_BADGE_COLORS[item["status"]]}>
                            {item["status"]}
                          </Badge>
                        </td>
                        <td>
                          <Badge ml={2} colorPalette={TAXON_BADGE_COLORS[item["position"]]}>
                            {item["position"]}
                          </Badge>
                        </td>
                        <td>
                          <HStack gap={0} wrap="wrap">
                            {item["hierarchy"]
                              ?.split(";")
                              .filter(Boolean)
                              .map((node, i, arr) => {
                                const [rank, rest] = node.split(":");
                                const [name, id] = rest?.split("#") ?? [];
                                return (
                                  <Fragment key={i}>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger asChild>
                                        <Text as="span" cursor="default">
                                          {name}
                                        </Text>
                                      </Tooltip.Trigger>
                                      <Tooltip.Positioner>
                                        <Tooltip.Content>
                                          {rank}: {name} #{id}
                                        </Tooltip.Content>
                                      </Tooltip.Positioner>
                                    </Tooltip.Root>
                                    {i < arr.length - 1 && (
                                      <Icon as={LuChevronRight} boxSize={3} mx={1} />
                                    )}
                                  </Fragment>
                                );
                              })}
                          </HStack>
                        </td>
                        <td>
                          <Text
                            float="right"
                            color={getStatusColor(item["action"])}
                            fontWeight="bold"
                          >
                            {item["action"]}
                          </Text>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Box mt={4}>
                <Checkbox
                  checked={termsAccepted}
                  onCheckedChange={(e) => setTermsAccepted(!!e.checked)}
                  colorPalette={"blue"}
                >
                  {t("traits:terms.description")}
                </Checkbox>
                {!termsAccepted && (
                  <Text color="red.500">{t("traits:trait_matching.terms_warning")}</Text>
                )}
              </Box>
              <Flex justifyContent="flex-end" mt={4}>
                <Button
                  colorPalette="blue"
                  onClick={() => {
                    const { namesCount, synonymsCount, commonNamesCount } = getCreationCounts();
                    const message = `This action will create ${namesCount} name${
                      namesCount !== 1 ? "s" : ""
                    }, ${synonymsCount} synonym${
                      synonymsCount !== 1 ? "s" : ""
                    }, and ${commonNamesCount} common name${
                      commonNamesCount !== 1 ? "s" : ""
                    }. Are you sure you want to proceed?`;

                    if (confirm(message)) {
                      handleSubmit();
                    }
                  }}
                  disabled={!termsAccepted}
                >
                  {t("traits:trait_matching.batch_upload")}
                </Button>
              </Flex>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
