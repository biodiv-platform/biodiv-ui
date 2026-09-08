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
import {
  LuChevronDown,
  LuChevronRight,
  LuMinus,
  LuPlus,
  LuRefreshCw,
  LuRepeat,
  LuTag
} from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { axBatchUpload, axUploadBatchFile } from "@/services/taxonomy.service";

import ColumnMapper from "../../traits/common/column-mapper";

const ACCEPT_STRING =
  "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Central mapping so the action badge looks identical everywhere it's used
// (main row, synonyms, common names).
const ACTION_BADGE: Record<string, { label: string; colorPalette: string; icon: any }> = {
  CREATE: { label: "Create", colorPalette: "green", icon: LuPlus },
  UPDATE: { label: "Update", colorPalette: "blue", icon: LuRefreshCw },
  NOOP: { label: "No change", colorPalette: "gray", icon: LuMinus },
  ERROR: { label: "Error", colorPalette: "red", icon: LuMinus }
};

type FieldChange = { field: string; oldValue: string; newValue: string };

function ActionBadge({
  action,
  changes,
  size = "sm"
}: {
  action: string;
  changes?: FieldChange[];
  size?: "sm" | "xs";
}) {
  const config = ACTION_BADGE[action] ?? ACTION_BADGE.NOOP;
  const hasChanges = action === "UPDATE" && changes && changes.length > 0;

  const badge = (
    <Badge
      colorPalette={config.colorPalette}
      variant="subtle"
      borderRadius="full"
      display="inline-flex"
      alignItems="center"
      gap={1}
      px={2}
      py={0.5}
      fontSize={size === "xs" ? "10px" : "xs"}
      cursor={hasChanges ? "default" : undefined}
    >
      <Icon as={config.icon} boxSize={3} />
      {config.label}
      {hasChanges && ` \u00b7 ${changes!.length}`}
    </Badge>
  );

  if (!hasChanges) return badge;

  return (
    <Tooltip.Root openDelay={150}>
      <Tooltip.Trigger asChild>{badge}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <VStack align="stretch" gap={1}>
            {changes!.map((change, i) => (
              <HStack key={i} gap={2} fontSize="xs" whiteSpace="nowrap">
                <Text color="gray.300" flexShrink={0}>
                  {change.field}:
                </Text>
                <Text color="gray.400" textDecoration="line-through">
                  {change.oldValue || "—"}
                </Text>
                <Icon as={LuChevronRight} boxSize={3} color="gray.400" />
                <Text color="green.300" fontWeight="medium">
                  {change.newValue || "—"}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}

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
          {items.map((it, i) => {
            const [name, matchedId] = it.split("|");
            const action = matchedId === "null" ? "CREATE" : "NOOP";
            return (
              <HStack key={i} justify="space-between" py={1.5} fontSize="xs">
                <Text color="gray.700">{name}</Text>
                <ActionBadge action={action} size="xs" />
              </HStack>
            );
          })}
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
      .filter(
        (item: any) =>
          item["action"] === "CREATE" || item["action"] === "NOOP" || item["action"] === "UPDATE"
      )
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
              <VStack align="stretch" gap={3}>
                {uploadResult &&
                  uploadResult.map((item, index) => {
                    const hierarchyNodes = item["hierarchy"]?.split(";").filter(Boolean) ?? [];
                    const changes:FieldChange[] = [];
                    if (item["status"].includes("#")) {
                      changes.push({ field: "Status", oldValue: item["status"].split("#")[0], newValue: item["status"].split("#")[1] });
                    }
                    if (item["position"].includes("#")) {
                      changes.push({ field: "Position", oldValue: item["position"].split("#")[0], newValue: item["position"].split("#")[1] });
                    }

                    return (
                      <Box
                        key={index}
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        p={4}
                      >
                        <Flex justify="space-between" align="flex-start" gap={3}>
                          <Box>
                            <Text fontWeight="medium">{item["scientificName"]}</Text>
                          </Box>
                          <HStack gap={1.5} flexShrink={0}>
                            <Badge colorPalette={TAXON_BADGE_COLORS[item["status"].split("#")[0]]}>
                              {item["status"].split("#")[0]}
                            </Badge>
                            <Badge
                              colorPalette={TAXON_BADGE_COLORS[item["position"].split("#")[0]]}
                            >
                              {item["position"].split("#")[0]}
                            </Badge>
                            <ActionBadge action={item["action"]} changes={changes}/>
                          </HStack>
                        </Flex>

                        {hierarchyNodes.length > 0 && (
                          <HStack gap={0} wrap="wrap" fontSize="sm" color="gray.500">
                            {hierarchyNodes.map((node, i, arr) => {
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
                        )}

                        {item["synonyms"] && item["synonyms"].length > 0 && (
                          <SubRowGroup label="Synonyms" icon={LuRepeat} items={item["synonyms"]} />
                        )}
                        {item["commonNames"] && item["commonNames"].length > 0 && (
                          <SubRowGroup
                            label="Common names"
                            icon={LuTag}
                            items={item["commonNames"]}
                          />
                        )}
                      </Box>
                    );
                  })}
              </VStack>
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
