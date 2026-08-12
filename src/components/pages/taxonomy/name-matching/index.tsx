import {
  Box,
  Button,
  FileUpload,
  Flex,
  Heading,
  Icon,
  Spinner,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import ColumnMapper from "@components/pages/traits/common/column-mapper";
import { axCheckSpecies } from "@services/species.service";
import { axUploadTaxonFile } from "@services/taxonomy.service";
import notification from "@utils/notification";
import ExcelJS from "exceljs";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useMemo, useState } from "react";
import { LuChevronDown, LuCircleAlert } from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

import NameTable from "./name-table";

type TaxonData = {
  id: string;
  name: string;
  rank: string;
  status: string;
  position: string;
};

const ACCEPT_STRING =
  "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Pure helpers — no hooks, no component state — safe at module scope
const updateColumnMapping = (
  setColumnMapping: React.Dispatch<React.SetStateAction<[number, string][]>>,
  colIndex: number,
  label: string
) => {
  setColumnMapping((prev) => {
    const updatedOptions = [...prev];
    const existingIndex = updatedOptions.findIndex(([i]) => i === colIndex);
    if (existingIndex !== -1) {
      updatedOptions[existingIndex] = [colIndex, label];
    } else {
      updatedOptions.push([colIndex, label]);
    }
    return updatedOptions;
  });
};

const buildHeaderMatchMap = (ranks: { name: string }[]) => {
  const map = new Map<string, string>();
  map.set("sci name", "Scientific name");
  map.set("scientific name", "Scientific name");
  map.set("synonyms", "Synonyms");
  map.set("common name", "Common Name");
  ranks.forEach((rank) => {
    const label = rank.name.charAt(0).toUpperCase() + rank.name.slice(1);
    map.set(rank.name.toLowerCase(), label);
  });
  return map;
};

export default function NameMatchingComponent({ ranks }) {
  const [uploadResult, setUploadResult] = useState<[string, TaxonData[]][]>([]);
  const [finalResult, setFinalResult] = useState<
    [string, TaxonData, any | null, boolean, number][]
  >([]);
  const [synonymResult, setSynonymResult] = useState<[string, TaxonData[]][]>([]);
  const [finalSynonymResult, setFinalSynonymResult] = useState<
    [string, TaxonData, any | null, boolean, number][]
  >([]);
  const [cnameResult, setCnameResult] = useState<[string, TaxonData[]][]>([]);
  const [hierResult, setHierResult] = useState<[string, TaxonData[]][]>([]);
  const [finalHierResult, setFinalHierResult] = useState<
    [string, TaxonData, any | null, boolean, number][]
  >([]);
  const { open: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [columnMapping, setColumnMapping] = useState<[number, string][]>([]);
  const [activeTab, setActiveTab] = useState("names");
  const [filter, setFilter] = useState<string>("Matched");
  const { t } = useTranslation();

  const matchStats = useMemo(() => {
    const extractName = ([key]: [string, any]) =>
      activeTab == "names"
        ? key.slice(0, -1).split("|")[selectedColumn ? selectedColumn : 0]
        : key.split("|")[0];
    const dedupe = (arr: [string, any][]) =>
      arr
        .map((item) => [item[0], extractName(item)] as [string, string])
        .filter(([, name], index, all) => all.findIndex(([, n]) => n === name) === index);
    switch (activeTab) {
      case "names":
        return {
          matched: uploadResult.filter(([, value]) => value.length != 0).length,
          total: uploadResult.length,
          unmatched: dedupe(uploadResult.filter(([, value]) => value.length === 0))
        };
      case "synonyms":
        return {
          matched: synonymResult.filter(([, value]) => value.length != 0).length,
          total: synonymResult.length,
          unmatched: dedupe(synonymResult.filter(([, value]) => value.length === 0))
        };
      case "common":
        return {
          matched: cnameResult.filter(([, value]) => Object.keys(value).length != 0).length,
          total: cnameResult.length,
          unmatched: dedupe(cnameResult.filter(([, value]) => Object.keys(value).length === 0))
        };
      case "hierarchy":
        return {
          matched: hierResult.filter(([, value]) => value.length != 0).length,
          total: hierResult.length,
          unmatched: dedupe(hierResult.filter(([, value]) => value.length === 0))
        };
      default:
        return { matched: 0, total: 0, unmatched: [] };
    }
  }, [activeTab, uploadResult, synonymResult, cnameResult, hierResult, selectedColumn]);

  const baseOptions = ["Scientific name", "Synonyms", "Common Name"];

  const rankOptions = ranks
    .map((rank) => rank.name.charAt(0).toUpperCase() + rank.name.slice(1))
    .sort((a, b) => {
      // preserve rankValue order (high to low, matching taxonomic hierarchy)
      const rankA = ranks.find((r) => r.name.toLowerCase() === a.toLowerCase())?.rankValue ?? 0;
      const rankB = ranks.find((r) => r.name.toLowerCase() === b.toLowerCase())?.rankValue ?? 0;
      return rankB - rankA;
    });

  const options = [...baseOptions, ...rankOptions];
  const headerMatchMap = useMemo(() => buildHeaderMatchMap(ranks), [ranks]);
  const [currentStep, setCurrentStep] = useState(1);

  const importAsExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    // Helper to build one sheet, reused for names/synonyms/cname
    const buildNameSheet = (
      sheetName: string,
      data,
      synonym: boolean = false,
      cname: boolean = false,
      hierarchy: boolean = false
    ) => {
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.columns = [
        ...(!hierarchy
          ? [
              {
                header: cname ? "CommonName" : "ScientificName",
                key: cname ? "CommonName" : "ScientificName"
              }
            ]
          : []),
        ...(synonym || cname || hierarchy ? [{ header: "Source", key: "Source" }] : []),
        ...(hierarchy
          ? [
              { header: "Rank", key: "Rank" },
              { header: "Name", key: "Name" }
            ]
          : []),
        {
          header: cname ? "CommonNameId" : "TaxonConceptId",
          key: cname ? "CommonNameId" : "TaxonConceptId"
        },
        ...(!cname
          ? [
              { header: "GroupName", key: "GroupName" },
              { header: "SpeciesId", key: "SpeciesId" }
            ]
          : [{ header: "Language", key: "Language" }])
      ];

      if (synonym === false && cname === false && hierarchy === false) {
        const newColumns = headers
          .filter((_, index) => index !== selectedColumn)
          .map((header) => ({ header, key: header }));
        worksheet.columns = [...worksheet.columns, ...newColumns];
      }

      data.forEach((name) => {
        if (name[1] && filter != "Unmatched") {
          const row: Record<string, any> = {};
          if (synonym === false && cname === false && hierarchy === false) {
            for (let i = 0; i < headers.length; i++) {
              if (i != selectedColumn) {
                row[headers[i]] = name[0].slice(0, -1).split("|")[i];
              }
            }
          }
          if (!hierarchy) {
            row[cname ? "CommonName" : "ScientificName"] = cname
              ? Object.entries(name[1]).length > 0
                ? name[1]["name"]
                : name[0].split("|")[0]
              : name[1]["name"];
          }
          row[cname ? "CommonNameId" : "TaxonConceptId"] = name[1]["id"];
          if (!cname) {
            row["GroupName"] = name[1]["group_name"];
            row["SpeciesId"] = name[2];
          } else {
            row["Language"] =
              Object.entries(name[1]).length > 0 ? name[1]["lang"] : name[0].split("|")[2];
          }
          if (synonym || cname || hierarchy) {
            row["Source"] =
              Object.entries(name[1]).length > 0 ? name[1]["source"] : name[0].split("|")[1];
          }
          if (hierarchy) {
            row["Rank"] = name[0].split("|")[2];
            row["Name"] = name[0].split("|")[0];
          }
          worksheet.addRow(row);
        } else if (name[1] == undefined && filter != "Matched") {
          const row: Record<string, any> = {};
          if (synonym === false && hierarchy === false) {
            for (let i = 0; i < headers.length; i++) {
              if (i != selectedColumn) {
                row[headers[i]] = name[0].slice(0, -1).split("|")[i];
              }
            }
            row["ScientificName"] = name[0].slice(0, -1).split("|")[
              selectedColumn ? selectedColumn : 0
            ];
          } else if (hierarchy) {
            row["Source"] = name[0].split("|")[1];
            row["Rank"] = name[0].split("|")[2];
            row["Name"] = name[0].split("|")[0];
          } else {
            row["ScientificName"] = name[0].split("|")[0];
            row["Source"] = name[0].split("|")[1];
          }
          worksheet.addRow(row);
        }
      });

      return worksheet;
    };

    buildNameSheet("Given Names", finalResult);
    buildNameSheet("Synonyms", finalSynonymResult, true);
    buildNameSheet("Common Names", cnameResult, false, true);
    buildNameSheet("Hierarchy", finalHierResult, false, false, true);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "names.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columnMappingSubmit = async () => {
    onClose1();
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    let rankMap = "";
    columnMapping.map(([colIndex, label]) => {
      if (label === "Scientific name") {
        setSelectedColumn(colIndex);
        formData.append("column", colIndex.toString());
      } else if (label === "Synonyms") {
        formData.append("synonym", colIndex.toString());
      } else if (label === "Common Name") {
        formData.append("cname", colIndex.toString());
      } else {
        rankMap = rankMap + "|" + label + ":" + colIndex.toString();
      }
    });
    formData.append("hierarchy", rankMap.slice(1));

    setLoading(true);

    const { success, data, error } = await axUploadTaxonFile(formData);
    if (success) {
      setUploadResult(data.data.flatMap((obj) => Object.entries(obj)));
      setSynonymResult(Object.entries(data.synonym));
      setCnameResult(Object.entries(data.cname));
      setHierResult(Object.entries(data.hierarchy));
      setHeaders(data.headers);
      (async () => {
        const processedData = await Promise.all(
          data.data.flatMap((obj, objindex) =>
            Object.entries(obj).map(async ([key, value]: [string, TaxonData[]]) => {
              const { success, data } = await axCheckSpecies(value[0]?.id);
              if (success) {
                return [key, value[0], data, false, objindex];
              }
              return [key, value[0], null, false, objindex];
            })
          )
        );
        const synonymData = await Promise.all(
          Object.entries(data.synonym).map(
            async (
              [key, value]: [string, TaxonData[]],
              objindex
            ): Promise<[string, TaxonData, any, boolean, number]> => {
              const { success, data } = await axCheckSpecies(value[0]?.id);
              if (success) {
                return [key, value[0], data, false, objindex];
              }
              return [key, value[0], null, false, objindex];
            }
          )
        );
        const hierData = await Promise.all(
          Object.entries(data.hierarchy).map(
            async (
              [key, value]: [string, TaxonData[]],
              objindex
            ): Promise<[string, TaxonData, any, boolean, number]> => {
              const { success, data } = await axCheckSpecies(value[0]?.id);
              if (success) {
                return [key, value[0], data, false, objindex];
              }
              return [key, value[0], null, false, objindex];
            }
          )
        );
        setFinalResult(processedData);
        setFinalSynonymResult(synonymData);
        setFinalHierResult(hierData);
        setLoading(false);
        setCurrentStep(2);
      })();
    } else {
      setLoading(false);
      notification(error?.message || "Something went wrong!");
    }
  };

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const targetFile = details.acceptedFiles[0];

      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification("Format not supported. Please drop an Excel file (.xls, .xlsx)");
        return;
      }

      if (targetFile) {
        setFile(targetFile); // ← runs first, as you wanted

        try {
          const workbook = new ExcelJS.Workbook();
          const arrayBuffer = await targetFile.arrayBuffer();
          await workbook.xlsx.load(arrayBuffer);

          const worksheet = workbook.worksheets[0];
          const firstRow = worksheet.getRow(1);
          const extractedHeaders: string[] = [];

          // headerMatchMap is just read here via closure — no hook call
          firstRow.eachCell((cell, colNumber) => {
            if (cell.value) {
              const cellValue = cell.value.toString();
              const colIndex = colNumber - 1;
              extractedHeaders.push(`${cellValue}|${colIndex}`);

              const matchedLabel = headerMatchMap.get(cellValue.toLowerCase().trim());
              if (matchedLabel) {
                updateColumnMapping(setColumnMapping, colIndex, matchedLabel);
              }
            }
          });

          setHeaders(extractedHeaders);
          onOpen1();
        } catch (error) {
          console.error("Error reading Excel file:", error);
        }
      } else {
        notification("No file selected!");
      }
    },
    [onOpen1, headerMatchMap] // ← add headerMatchMap here
  );

  return (
    <Box p={4}>
      {/* Progress Bar */}
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        {t("taxon:name_matching.description")}
      </Alert>
      <Box mt={6} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        {isLoading && <Spinner></Spinner>}
        {currentStep == 1 && !isLoading && (
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
                  bg={fileUpload.dragging ? "blue.100" : "transparent"}
                  border="none"
                  p={0}
                  minH="calc(100vh - var(--heading-height))"
                  id="dropzone"
                  cursor="inherit"
                  width="full"
                >
                  <Box width="full" height="full" onClick={(e) => e.stopPropagation()}>
                    <Flex
                      minH="calc(100vh - var(--heading-height))"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Flex flexDir="column" alignItems="center" p={4}>
                        <UploadIcon size={100} />
                        <Heading size="lg" fontWeight="normal" color="gray.400" mt={8}>
                          {t("taxon:name_matching.upload_description")}
                        </Heading>
                        <Button
                          colorPalette="blue"
                          onClick={() => fileUpload.openFilePicker()}
                          mb={8}
                        >
                          {t("taxon:name_matching.upload_button")}
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
          description={t("taxon:name_matching.columnMapping_description")}
          headers={headers}
          columnMapping={columnMapping}
          setColumnMapping={setColumnMapping}
          onSubmit={columnMappingSubmit}
          optionDisabled={columnMapping.filter(([, i]) => i === "Scientific name").length == 0}
        />

        {currentStep == 2 && (
          <>
            <Flex justifyContent="space-between" alignItems="center" bg="white" p={4}>
              <Text fontSize="lg">
                <Text as="span" color="blue.500" fontWeight="bold">
                  {matchStats.matched}
                </Text>{" "}
                out of{" "}
                <Text as="span" fontWeight="bold">
                  {matchStats.total}
                </Text>{" "}
                names matched successfully.
              </Text>

              <Flex justifyContent="flex-end">
                <MenuRoot>
                  <MenuTrigger asChild>
                    <Button>
                      {t("taxon:name_matching.download_button")}
                      <LuChevronDown />
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem value="importAsExcel" onClick={importAsExcel}>
                      {t("taxon:name_matching.download_excel")}
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>
              </Flex>
            </Flex>
            <Box mb={4}>
              {matchStats.unmatched.length != 0 && (
                <Box bg="red.500" color="white" p={4} borderRadius="md" boxShadow="md" mb={4}>
                  <Text fontSize="md" fontWeight="bold">
                    <Icon w={5} h={5} mr={4}>
                      <LuCircleAlert />
                    </Icon>
                    {t("taxon:name_matching.warning_text")}
                  </Text>
                  {matchStats.unmatched.map(([key]) => (
                    <Box ml={9} key={key}>
                      {selectedColumn != null && activeTab == "names"
                        ? key.slice(0, -1).split("|")[selectedColumn ? selectedColumn : 0]
                        : key.split("|")[0]}
                    </Box>
                  ))}
                </Box>
              )}
              <Box mb={4} width="100%">
                <NativeSelectRoot maxW="10rem" ml="auto">
                  <NativeSelectField
                    value={filter}
                    onChange={(e) => setFilter(e?.currentTarget?.value)}
                  >
                    <option value="All">{t("taxon:name_matching.all_filter")}</option>
                    <option value="Matched">{t("taxon:name_matching.matched_filter")}</option>
                    <option value="Single Matched">{"Single Matched"}</option>
                    <option value="Multiple Matched">{"Multiple Matched"}</option>
                    <option value="Unmatched">{t("taxon:name_matching.unmatched_filter")}</option>
                  </NativeSelectField>
                </NativeSelectRoot>
                <Tabs.Root
                  value={activeTab}
                  onValueChange={(details) => setActiveTab(details.value)}
                  lazyMount={true}
                  variant={"line"}
                >
                  <Tabs.List>
                    <Tabs.Trigger value="names">{"Given names"}</Tabs.Trigger>
                    <Tabs.Trigger value="synonyms">{"Synonyms"}</Tabs.Trigger>
                    <Tabs.Trigger value="common">{"Common names"}</Tabs.Trigger>
                    <Tabs.Trigger value="hierarchy">{"Hierarchy"}</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="names">
                    {filter == "Matched" && (
                      <NameTable
                        finalResult={finalResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return uploadResult[uploadIdx]?.[1]?.length > 0;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setFinalResult}
                        setUploadResult={setUploadResult}
                      />
                    )}
                    {filter == "Single Matched" && (
                      <NameTable
                        finalResult={finalResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return uploadResult[uploadIdx]?.[1]?.length === 1;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setFinalResult}
                        setUploadResult={setUploadResult}
                      />
                    )}
                    {filter == "Multiple Matched" && (
                      <NameTable
                        finalResult={finalResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return uploadResult[uploadIdx]?.[1]?.length > 1;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setFinalResult}
                        setUploadResult={setUploadResult}
                      />
                    )}
                    {filter == "All" && (
                      <NameTable
                        finalResult={finalResult}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setFinalResult}
                        setUploadResult={setUploadResult}
                      />
                    )}
                    {filter == "Unmatched" && (
                      <NameTable
                        finalResult={finalResult.filter(([, value, ,]) => value == undefined)}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setFinalResult}
                        setUploadResult={setUploadResult}
                      />
                    )}
                  </Tabs.Content>
                  <Tabs.Content value="synonyms">
                    {filter == "Matched" && (
                      <NameTable
                        finalResult={finalSynonymResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return synonymResult[uploadIdx]?.[1]?.length > 0;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={synonymResult}
                        setFinalResult={setFinalSynonymResult}
                        setUploadResult={setSynonymResult}
                        synonym={true}
                      />
                    )}
                    {filter == "Single Matched" && (
                      <NameTable
                        finalResult={finalSynonymResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return synonymResult[uploadIdx]?.[1]?.length === 1;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={synonymResult}
                        setFinalResult={setFinalSynonymResult}
                        setUploadResult={setSynonymResult}
                        synonym={true}
                      />
                    )}
                    {filter == "Multiple Matched" && (
                      <NameTable
                        finalResult={finalSynonymResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return synonymResult[uploadIdx]?.[1]?.length > 1;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={synonymResult}
                        setFinalResult={setFinalSynonymResult}
                        setUploadResult={setSynonymResult}
                        synonym={true}
                      />
                    )}
                    {filter == "All" && (
                      <NameTable
                        finalResult={finalSynonymResult}
                        selectedColumn={selectedColumn}
                        uploadResult={synonymResult}
                        setFinalResult={setFinalSynonymResult}
                        setUploadResult={setSynonymResult}
                        synonym={true}
                      />
                    )}
                    {filter == "Unmatched" && (
                      <NameTable
                        finalResult={finalSynonymResult.filter(
                          ([, value, ,]) => value == undefined
                        )}
                        selectedColumn={selectedColumn}
                        uploadResult={synonymResult}
                        setFinalResult={setFinalSynonymResult}
                        setUploadResult={setSynonymResult}
                        synonym={true}
                      />
                    )}
                  </Tabs.Content>
                  <Tabs.Content value="common">
                    {filter == "Matched" && (
                      <NameTable
                        finalResult={cnameResult.filter(([, value]) => {
                          if (value == undefined) return false;
                          return Object.keys(value).length > 0;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setCnameResult}
                        setUploadResult={setUploadResult}
                        cname={true}
                      />
                    )}
                    {filter == "All" && (
                      <NameTable
                        finalResult={cnameResult}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setCnameResult}
                        setUploadResult={setUploadResult}
                        cname={true}
                      />
                    )}
                    {filter == "Unmatched" && (
                      <NameTable
                        finalResult={cnameResult.filter(
                          ([, value]) => value == undefined || Object.keys(value).length === 0
                        )}
                        selectedColumn={selectedColumn}
                        uploadResult={uploadResult}
                        setFinalResult={setCnameResult}
                        setUploadResult={setUploadResult}
                        cname={true}
                      />
                    )}
                  </Tabs.Content>
                  <Tabs.Content value="hierarchy">
                    {filter == "Matched" && (
                      <NameTable
                        finalResult={finalHierResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return hierResult[uploadIdx]?.[1]?.length > 0;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={hierResult}
                        setFinalResult={setFinalHierResult}
                        setUploadResult={setHierResult}
                        hierarchy={true}
                      />
                    )}
                    {filter == "Single Matched" && (
                      <NameTable
                        finalResult={finalHierResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return hierResult[uploadIdx]?.[1]?.length === 1;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={hierResult}
                        setFinalResult={setFinalHierResult}
                        setUploadResult={setHierResult}
                        hierarchy={true}
                      />
                    )}
                    {filter == "Multiple Matched" && (
                      <NameTable
                        finalResult={finalHierResult.filter(([, value, , , uploadIdx]) => {
                          if (value == undefined) return false;
                          return hierResult[uploadIdx]?.[1]?.length > 1;
                        })}
                        selectedColumn={selectedColumn}
                        uploadResult={hierResult}
                        setFinalResult={setFinalHierResult}
                        setUploadResult={setHierResult}
                        hierarchy={true}
                      />
                    )}
                    {filter == "All" && (
                      <NameTable
                        finalResult={finalHierResult}
                        selectedColumn={selectedColumn}
                        uploadResult={hierResult}
                        setFinalResult={setFinalHierResult}
                        setUploadResult={setHierResult}
                        hierarchy={true}
                      />
                    )}
                    {filter == "Unmatched" && (
                      <NameTable
                        finalResult={finalHierResult.filter(([, value, ,]) => value == undefined)}
                        selectedColumn={selectedColumn}
                        uploadResult={hierResult}
                        setFinalResult={setFinalHierResult}
                        setUploadResult={setHierResult}
                        hierarchy={true}
                      />
                    )}
                  </Tabs.Content>
                </Tabs.Root>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
