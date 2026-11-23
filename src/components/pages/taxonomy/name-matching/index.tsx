import {
  Box,
  Button,
  FileUpload,
  Flex,
  Heading,
  Spinner,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import ColumnMapper from "@components/pages/traits/common/column-mapper";
import useGlobalState from "@hooks/use-global-state";
import { axGetNameMatchingResultsFromFile, axUploadTaxonFile } from "@services/taxonomy.service";
import { ENDPOINT } from "@static/constants";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useMemo, useState } from "react";
import { LuChevronDown, LuDownload } from "react-icons/lu";

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
  // Species page id for this taxon, filled in by the backend (null if none)
  speciesId?: number | null;
};

type ResultRow = [string, TaxonData, any | null, boolean, number];

// "create" ignores the match and exports the row as unmatched (TaxonConceptId = CREATE)
export type MatchAction = "match" | "update" | "create";

const ACCEPT_STRING =
  "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// ExcelJS is large (~1 MB); load it only when a file is read or exported
const newWorkbook = async () => {
  const { Workbook } = await import("exceljs");
  return new Workbook();
};

// Returns a setter-based remover / replacer that works on the FULL list by row identity,
// so editing or deleting while a filter is active never drops the hidden rows
const removeRowFrom =
  <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
  (row: T) =>
    setter((prev) => prev.filter((r) => r !== row));

const replaceRowIn =
  <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
  (row: T, next: T) =>
    setter((prev) => prev.map((r) => (r === row ? next : r)));

// Key used for the Source column in the Given Names sheet.
// Prefixed so it never collides with an uploaded column that is also named "Source".
const SOURCE_COLUMN_KEY = "__source";

// Filters that only make sense for tabs with taxon matches (not Common names)
const TAXON_ONLY_FILTERS = ["Single Matched", "Multiple Matched"];

// Options for the separate status filter (matched taxon status)
const STATUS_FILTERS = [
  { value: "All", label: "All statuses" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "SYNONYM", label: "Synonym" }
];

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

// Strips the "|<index>" suffix that is added to headers read from the uploaded file
const stripHeaderIndex = (header: string) => header.replace(/\|\d+$/, "");

const hasStatus = (value: TaxonData | undefined, status: string) =>
  (value?.status ?? "").toUpperCase() === status;

// Applies the selected filter to a Given Names / Synonyms / Hierarchy result list
const filterTaxonRows = (
  rows: ResultRow[],
  rawResult: [string, TaxonData[]][],
  filter: string
): ResultRow[] => {
  const matchCount = (idx: number) => rawResult[idx]?.[1]?.length ?? 0;
  switch (filter) {
    case "Matched":
      return rows.filter(([, value, , , idx]) => value != undefined && matchCount(idx) > 0);
    case "Single Matched":
      return rows.filter(([, value, , , idx]) => value != undefined && matchCount(idx) === 1);
    case "Multiple Matched":
      return rows.filter(([, value, , , idx]) => value != undefined && matchCount(idx) > 1);
    case "Unmatched":
      return rows.filter(([, value]) => value == undefined);
    default:
      return rows;
  }
};

// Applies the status filter on top of the match filter; "All" keeps every row
const filterByStatus = (rows: ResultRow[], statusFilter: string): ResultRow[] =>
  statusFilter === "All" ? rows : rows.filter(([, value]) => hasStatus(value, statusFilter));

// Common names have no status / match count, so only All / Matched / Unmatched apply
const filterCnameRows = (rows: [string, any][], filter: string) => {
  switch (filter) {
    case "Matched":
      return rows.filter(([, value]) => value != undefined && Object.keys(value).length > 0);
    case "Unmatched":
      return rows.filter(([, value]) => value == undefined || Object.keys(value).length === 0);
    default:
      return rows;
  }
};

export default function NameMatchingComponent({ ranks }) {
  const [uploadResult, setUploadResult] = useState<[string, TaxonData[]][]>([]);
  const [finalResult, setFinalResult] = useState<ResultRow[]>([]);
  const [synonymResult, setSynonymResult] = useState<[string, TaxonData[]][]>([]);
  const [finalSynonymResult, setFinalSynonymResult] = useState<ResultRow[]>([]);
  const [cnameResult, setCnameResult] = useState<[string, TaxonData[]][]>([]);
  const [hierResult, setHierResult] = useState<[string, TaxonData[]][]>([]);
  const [finalHierResult, setFinalHierResult] = useState<ResultRow[]>([]);
  const { open: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [columnMapping, setColumnMapping] = useState<[number, string][]>([]);
  const [activeTab, setActiveTab] = useState("names");
  const [filter, setFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  // Per-record action for Given Names, keyed by upload index + row key
  const [rowActions, setRowActions] = useState<Record<string, MatchAction>>({});
  // Upload stage on step 1:
  //  "submit"    -> original file is sent for async matching; result is emailed to the user
  //  "processed" -> the emailed (processed) file is uploaded and the results are shown
  const [uploadStage, setUploadStage] = useState<"submit" | "processed">("submit");
  // True once the original file has been accepted for async processing
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();
  const { nameMatchingFile } = useGlobalState();

  // Counts come from the rows currently in the table, so deleted rows are not counted
  const matchStats = useMemo(() => {
    const countRows = (rows: ResultRow[], raw: [string, TaxonData[]][]) => ({
      matched: rows.filter((row) => (raw[row[4]]?.[1]?.length ?? 0) > 0).length,
      total: rows.length
    });
    switch (activeTab) {
      case "names":
        return countRows(finalResult, uploadResult);
      case "synonyms":
        return countRows(finalSynonymResult, synonymResult);
      case "hierarchy":
        return countRows(finalHierResult, hierResult);
      case "common":
        return {
          matched: cnameResult.filter(([, value]) => value && Object.keys(value).length != 0)
            .length,
          total: cnameResult.length
        };
      default:
        return { matched: 0, total: 0 };
    }
  }, [
    activeTab,
    finalResult,
    uploadResult,
    finalSynonymResult,
    synonymResult,
    finalHierResult,
    hierResult,
    cnameResult
  ]);

  // Column mapper options: base fields, then ranks high to low (taxonomic hierarchy order)
  const options = useMemo(() => {
    const rankOptions = [...ranks]
      .sort((a, b) => (b.rankValue ?? 0) - (a.rankValue ?? 0))
      .map((rank) => rank.name.charAt(0).toUpperCase() + rank.name.slice(1));
    return ["Scientific name", "Synonyms", "Common Name", ...rankOptions];
  }, [ranks]);
  const headerMatchMap = useMemo(() => buildHeaderMatchMap(ranks), [ranks]);
  const [currentStep, setCurrentStep] = useState(1);

  const getRowActionKey = (row: ResultRow) => `${row[4]}|${row[0]}`;

  // Name from the uploaded file for a Given Names row
  const getUploadedName = useCallback(
    (row: ResultRow) => row[0].slice(0, -1).split("#")[selectedColumn ? selectedColumn : 0] ?? "",
    [selectedColumn]
  );

  // Update is only allowed when there is a match and its name differs from the uploaded name
  const canUpdate = useCallback(
    (row: ResultRow) => {
      const matchedName = row[1]?.name;
      if (!matchedName) return false;
      return getUploadedName(row).trim().toLowerCase() !== matchedName.trim().toLowerCase();
    },
    [getUploadedName]
  );

  // Create is allowed whenever there is a match to override
  const canCreate = useCallback((row: ResultRow) => !!row[1], []);

  // Falls back to "match" if the row is no longer eligible for the chosen action
  const getRowAction = useCallback(
    (row: ResultRow): MatchAction => {
      const action = rowActions[getRowActionKey(row)] ?? "match";
      if (action === "update") return canUpdate(row) ? "update" : "match";
      if (action === "create") return canCreate(row) ? "create" : "match";
      return "match";
    },
    [rowActions, canUpdate, canCreate]
  );

  const setRowAction = useCallback(
    (row: ResultRow, value: MatchAction) =>
      setRowActions((prev) => ({ ...prev, [getRowActionKey(row)]: value })),
    []
  );

  // Filtered rows per tab, recomputed only when their inputs change
  const filteredNames = useMemo(
    () => filterByStatus(filterTaxonRows(finalResult, uploadResult, filter), statusFilter),
    [finalResult, uploadResult, filter, statusFilter]
  );
  const filteredSynonyms = useMemo(
    () => filterByStatus(filterTaxonRows(finalSynonymResult, synonymResult, filter), statusFilter),
    [finalSynonymResult, synonymResult, filter, statusFilter]
  );
  const filteredCnames = useMemo(() => filterCnameRows(cnameResult, filter), [cnameResult, filter]);
  const filteredHier = useMemo(
    () => filterByStatus(filterTaxonRows(finalHierResult, hierResult, filter), statusFilter),
    [finalHierResult, hierResult, filter, statusFilter]
  );

  // Given Names rows (in the current filter) that can be switched to Update
  const updatableNames = useMemo(() => filteredNames.filter(canUpdate), [filteredNames, canUpdate]);

  // Sets the action to Update for every eligible row in the current filter
  const setAllToUpdate = () =>
    setRowActions((prev) => {
      const next = { ...prev };
      updatableNames.forEach((row) => {
        next[getRowActionKey(row)] = "update";
      });
      return next;
    });

  // Row delete / update handlers for each tab, applied to the full (unfiltered) lists
  const rowHandlers = useMemo(
    () => ({
      names: { onDeleteRow: removeRowFrom(setFinalResult), onUpdateRow: replaceRowIn(setFinalResult) },
      synonyms: {
        onDeleteRow: removeRowFrom(setFinalSynonymResult),
        onUpdateRow: replaceRowIn(setFinalSynonymResult)
      },
      common: {
        onDeleteRow: removeRowFrom<any>(setCnameResult),
        onUpdateRow: replaceRowIn<any>(setCnameResult)
      },
      hierarchy: {
        onDeleteRow: removeRowFrom(setFinalHierResult),
        onUpdateRow: replaceRowIn(setFinalHierResult)
      }
    }),
    []
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Common names don't support the taxon-only filters
    if (value === "common" && TAXON_ONLY_FILTERS.includes(filter)) {
      setFilter("All");
    }
  };

  const importAsExcel = async () => {
    const workbook = await newWorkbook();

    // Given Names only: Source holds the uploaded name when the record's action is Update
    const getSourceValue = (name) => (getRowAction(name) === "update" ? getUploadedName(name) : "");

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
        ...(synonym || cname || hierarchy
          ? [
              { header: "Source", key: "Source" },
              { header: "Index", key: "Index" }
            ]
          : []),
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
              { header: "SpeciesId", key: "SpeciesId" },
              ...(!synonym && !cname && !hierarchy
                ? [{ header: "MatchedName", key: "MatchedName" }]
                : []),
              { header: "MatchedStatus", key: "MatchedStatus" },
              { header: "MatchedPosition", key: "MatchedPosition" },
              { header: "MatchedHierarchy", key: "MatchedHierarchy" },
              ...(!synonym && !cname && !hierarchy
                ? [
                    { header: "MatchedRank", key: "MatchedRank" },
                    { header: "MatchedAcceptedId", key: "MatchedAcceptedId" },
                    { header: "TargetStatus", key: "TargetStatus" },
                    { header: "TargetPosition", key: "TargetPosition" },
                    { header: "TargetRank", key: "TargetRank" },
                    { header: "TargetAcceptedId", key: "TargetAcceptedId" },
                    // Batch upload (assignUpload) reads this sheet by column position
                    // (0-based): NameAction is 14. Keep in step with GIVEN_NAME_ACTION_COL
                    // in TaxonomyDefinitionServiceImpl.
                    { header: "NameAction", key: "NameAction" }
                  ]
                : [{ header: "TargetPosition", key: "TargetPosition" }])
            ]
          : [
              { header: "Language", key: "Language" },
              { header: "TargetPrefferedCommonName", key: "TargetPrefferedCommonName" }
            ]),
        ...(synonym
          ? [
              { header: "Rank", key: "Rank" },
              { header: "AcceptedId", key: "AcceptedId" }
            ]
          : [])
      ];

      if (synonym === false && cname === false && hierarchy === false) {
        const newColumns = headers
          .filter((_, index) => index !== selectedColumn)
          .map((header) => ({ header, key: header }));
        worksheet.columns = [...worksheet.columns, ...newColumns];
      }

      data.forEach((name) => {
        const isGivenNames = !synonym && !cname && !hierarchy;
        // Given Names rows marked "create" are exported as unmatched
        const treatAsUnmatched = isGivenNames && getRowAction(name) === "create";

        if (name[1] && !treatAsUnmatched && filter != "Unmatched") {
          const row: Record<string, any> = {};
          if (synonym === false && cname === false && hierarchy === false) {
            for (let i = 0; i < headers.length; i++) {
              if (i != selectedColumn) {
                row[headers[i]] = name[0].slice(0, -1).split("#")[i];
              }
            }
          }
          if (!hierarchy) {
            row[cname ? "CommonName" : "ScientificName"] = cname
              ? Object.entries(name[1]).length > 0
                ? name[1]["name"]
                : name[0].split("#")[0]
              : !synonym && !hierarchy
              ? getUploadedName(name)
              : name[1]["name"];
          }
          if (!synonym && !cname && !hierarchy) {
            row["MatchedRank"] = name[1]["rank"];
            row["MatchedAcceptedId"] = Array.isArray(name[1]["acceptedId"])
              ? name[1]["acceptedId"].join(",")
              : "";
          }
          if (synonym) {
            row["Rank"] = name[1]["rank"];
            row["AcceptedId"] = Array.isArray(name[1]["acceptedId"])
              ? name[1]["acceptedId"].join(",")
              : "";
          }
          row[cname ? "CommonNameId" : "TaxonConceptId"] = name[1]["id"];
          if (!cname) {
            row["GroupName"] = name[1]["group_name"];
            row["SpeciesId"] = name[2];
            row["MatchedStatus"] = name[1]["status"];
            row["MatchedPosition"] = name[1]["position"];
            row["MatchedName"] = name[1]["name"];
            row["NameAction"] = getRowAction(name);
            const hierarchy = name[1]["hierarchy"];

            const hier = Array.isArray(hierarchy)
              ? hierarchy
                  .map((item) => `${item.taxon_rank}:${item.taxon_name}#${item.taxon_id}`)
                  .join("|")
              : "";

            row["MatchedHierarchy"] = hier;
          } else {
            row["Language"] =
              Object.entries(name[1]).length > 0 ? name[1]["lang"] : name[0].split("#")[2];
            if (Object.entries(name[1]).length == 0) {
              row["CommonNameId"] = "CREATE";
            }
          }
          if (synonym || cname || hierarchy) {
            row["Source"] =
              Object.entries(name[1]).length > 0 && !hierarchy ? name[1]["source"] : name[0].split("#")[1];
            row["Index"] = synonym ? name[0].split("#")[2] : name[0].split("#")[3];
          }
          if (hierarchy) {
            row["Rank"] = name[0].split("#")[2];
            row["Name"] = name[0].split("#")[0];
          }
          if (!synonym && !cname && !hierarchy) {
            row[SOURCE_COLUMN_KEY] = getSourceValue(name);
          }
          if (cname && Object.entries(name[1]).length > 0 && filter != "Unmatched") {
            worksheet.addRow(row);
          } else if (cname && filter != "Matched") {
            worksheet.addRow(row);
          } else if (!cname) {
            worksheet.addRow(row);
          }
        } else if ((name[1] == undefined || treatAsUnmatched) && filter != "Matched") {
          const row: Record<string, any> = {};
          if (synonym === false && hierarchy === false) {
            for (let i = 0; i < headers.length; i++) {
              if (i != selectedColumn) {
                row[headers[i]] = name[0].slice(0, -1).split("#")[i];
              }
            }
            row["ScientificName"] = name[0].slice(0, -1).split("#")[
              selectedColumn ? selectedColumn : 0
            ];
            if (cname){
            row["TaxonConceptId"] = "CREATE";
            }else{
              row["NameAction"] = "create"
            }
            row["TargetStatus"] = "ACCEPTED";
            row["TargetPosition"] = "RAW";
          } else if (hierarchy) {
            row["Source"] = name[0].split("#")[1];
            row["Index"] = name[0].split("#")[3];
            row["Rank"] = name[0].split("#")[2];
            row["Name"] = name[0].split("#")[0];
            row["TaxonConceptId"] = "CREATE";
          } else {
            row["ScientificName"] = name[0].split("#")[0];
            row["Source"] = name[0].split("#")[1];
            row["Index"] = synonym ? name[0].split("#")[2] : name[0].split("#")[3];
            row["TaxonConceptId"] = "CREATE";
            if (synonym) {
              row["AcceptedId"] = finalResult[name[0].split("#")[2] - 1][1]["id"];
            }
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

    // Matching now runs asynchronously; the processed file is emailed to the user
    const { success, error } = await axUploadTaxonFile(formData);
    setLoading(false);
    if (success) {
      setIsSubmitted(true);
      notification(
        t("taxon:name_matching.submit_success", {}, {
          default: "File submitted. The processed file will be emailed to you."
        }),
        NotificationType.Success
      );
    } else {
      notification(error?.message || "Something went wrong!");
    }
  };

  // Scientific name column of the processed file: taken from the response (the backend
  // reads it from the processed file), otherwise detected from the headers, falling
  // back to the first column
  const resolveScientificNameColumn = useCallback(
    (data, responseHeaders: string[]): number => {
      if (typeof data?.column === "number") return data.column;

      const normalized = responseHeaders.map((h) => stripHeaderIndex(h).toLowerCase().trim());

      // Exact match first ("scientific name", "sci name")
      const exact = normalized.findIndex((h) => headerMatchMap.get(h) === "Scientific name");
      if (exact !== -1) return exact;

      // Then any header that contains it ("species scientific name")
      const partial = normalized.findIndex(
        (h) => h.includes("scientific name") || h.includes("sci name")
      );
      return partial !== -1 ? partial : 0;
    },
    [headerMatchMap]
  );

  // Loads the match results returned for a processed file into the results view
  const applyMatchResult = useCallback(
    (data) => {
      const rows: Record<string, TaxonData[]>[] = data?.data ?? [];
      const synonyms: Record<string, TaxonData[]> = data?.synonym ?? {};
      const cnames: Record<string, TaxonData[]> = data?.cname ?? {};
      const hierarchy: Record<string, TaxonData[]> = data?.hierarchy ?? {};
      const responseHeaders: string[] = data?.headers ?? [];

      setUploadResult(rows.flatMap((obj) => Object.entries(obj)));
      setSynonymResult(Object.entries(synonyms));
      setCnameResult(Object.entries(cnames));
      setHierResult(Object.entries(hierarchy));
      setHeaders(responseHeaders);
      setSelectedColumn(resolveScientificNameColumn(data, responseHeaders));
      setRowActions({});

      // Species id comes with each match from the backend — no per-row calls
      const toResultRow = (key: string, value: TaxonData[], objindex: number): ResultRow => [
        key,
        value[0],
        value[0]?.speciesId ?? null,
        false,
        objindex
      ];
      setFinalResult(
        rows.flatMap((obj, objindex) =>
          Object.entries(obj).map(([key, value]) => toResultRow(key, value, objindex))
        )
      );
      setFinalSynonymResult(
        Object.entries(synonyms).map(([key, value], objindex) => toResultRow(key, value, objindex))
      );
      setFinalHierResult(
        Object.entries(hierarchy).map(([key, value], objindex) => toResultRow(key, value, objindex))
      );

      setActiveTab("names");
      setFilter("All");
      setStatusFilter("All");
      setCurrentStep(2);
    },
    [resolveScientificNameColumn]
  );

  // Stage 2: upload the processed file received by email and show the results
  const handleProcessedFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification("Format not supported. Please drop an Excel file (.xls, .xlsx)");
        return;
      }

      const targetFile = details.acceptedFiles[0];
      if (!targetFile) {
        notification("No file selected!");
        return;
      }

      // Pass the File itself; the service builds the FormData
      setLoading(true);
      const { success, data } = await axGetNameMatchingResultsFromFile(targetFile);
      setLoading(false);

      if (success) {
        applyMatchResult(data);
      } else {
        notification(
          t("taxon:name_matching.processed_upload_error", {}, {
            default: "Could not read the processed file. Please upload the file you received by email."
          })
        );
      }
    },
    [applyMatchResult, t]
  );

  // Loads the user's latest processed file straight from storage, so they don't have to
  // download it from the email and upload it again
  const loadLatestResult = async () => {
    if (!nameMatchingFile?.filePath) return;
    setLoading(true);
    let latestFile: File | null = null;
    try {
      const response = await fetch(`${ENDPOINT.RAW}${nameMatchingFile.filePath}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      latestFile = new File([blob], nameMatchingFile.fileName, { type: XLSX_MIME });
    } catch (e) {
      console.error("Could not fetch latest name-matching file:", e);
    }
    setLoading(false);

    if (latestFile) {
      await handleProcessedFileChange({ acceptedFiles: [latestFile], rejectedFiles: [] });
    } else {
      notification(
        t("taxon:name_matching.latest_result_error", {}, {
          default: "Could not load your latest result. Please upload the file from your email."
        })
      );
    }
  };

  // Back to the upload screen from the results view
  const startOver = () => {
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  // Stage 1: read headers from the original file and open the column mapper
  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const targetFile = details.acceptedFiles[0];

      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification("Format not supported. Please drop an Excel file (.xls, .xlsx)");
        return;
      }

      if (targetFile) {
        setFile(targetFile);
        // Mapping from a previously selected file doesn't apply to this one
        setColumnMapping([]);

        try {
          const workbook = await newWorkbook();
          const arrayBuffer = await targetFile.arrayBuffer();
          await workbook.xlsx.load(arrayBuffer);

          const worksheet = workbook.worksheets[0];
          const firstRow = worksheet.getRow(1);
          const extractedHeaders: string[] = [];

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
    [onOpen1, headerMatchMap]
  );

  // Shared dropzone for both upload stages
  const renderDropzone = (
    onFileChange: (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => void,
    description: string,
    buttonLabel: string
  ) => (
    <FileUpload.Root
      accept={ACCEPT_STRING}
      onFileChange={onFileChange}
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
                  <Heading
                    size="lg"
                    fontWeight="normal"
                    color="gray.400"
                    mt={8}
                    mb={4}
                    textAlign="center"
                  >
                    {description}
                  </Heading>
                  <Button colorPalette="blue" onClick={() => fileUpload.openFilePicker()} mb={8}>
                    {buttonLabel}
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </FileUpload.Dropzone>
        )}
      </FileUpload.Context>
    </FileUpload.Root>
  );

  return (
    <Box p={4}>
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        {t("taxon:name_matching.description")}

        {t("taxon:name_matching.format")}
      </Alert>
      <Box mt={6} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        {isLoading && <Spinner></Spinner>}
        {currentStep == 1 && !isLoading && (
          <Tabs.Root
            value={uploadStage}
            onValueChange={(details) => setUploadStage(details.value as "submit" | "processed")}
            variant="enclosed"
            fitted
          >
            <Tabs.List>
              <Tabs.Trigger value="submit">
                {t("taxon:name_matching.stage_submit", {}, { default: "1. Submit file for matching" })}
              </Tabs.Trigger>
              <Tabs.Trigger value="processed">
                {t("taxon:name_matching.stage_processed", {}, {
                  default: "2. Upload processed file"
                })}
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="submit">
              {isSubmitted ? (
                <Flex
                  minH="calc(100vh - var(--heading-height))"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Flex flexDir="column" alignItems="center" gap={6} maxW="xl" textAlign="center">
                    <Alert
                      status="success"
                      borderRadius="md"
                      title={t("taxon:name_matching.submitted_title", {}, {
                        default: "Your file is being processed"
                      })}
                    >
                      {t("taxon:name_matching.submitted_description", {}, {
                        default:
                          "Name matching runs in the background. Once it is done, the processed Excel file will be emailed to you. Upload that file in step 2 to review the results."
                      })}
                    </Alert>
                    <Flex gap={3}>
                      <Button colorPalette="blue" onClick={() => setUploadStage("processed")}>
                        {t("taxon:name_matching.go_to_processed", {}, {
                          default: "Upload processed file"
                        })}
                      </Button>
                      <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                        {t("taxon:name_matching.submit_another", {}, {
                          default: "Submit another file"
                        })}
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              ) : (
                renderDropzone(
                  handleFileChange,
                  t("taxon:name_matching.upload_description"),
                  t("taxon:name_matching.upload_button")
                )
              )}
            </Tabs.Content>

            <Tabs.Content value="processed">
              {nameMatchingFile?.filePath && (
                <Flex
                  align="center"
                  justify="space-between"
                  gap={4}
                  wrap="wrap"
                  bg="green.50"
                  borderWidth={1}
                  borderColor="green.200"
                  borderRadius="md"
                  p={4}
                  mb={4}
                >
                  <Text>
                    {t("taxon:name_matching.latest_result_ready", {}, {
                      default: "Your latest result is ready:"
                    })}{" "}
                    <b>{nameMatchingFile.fileName}</b>
                    {nameMatchingFile.lastModified && (
                      <Text as="span" color="gray.600">
                        {` (${new Date(nameMatchingFile.lastModified).toLocaleString()})`}
                      </Text>
                    )}
                  </Text>
                  <Flex gap={2}>
                    <Button colorPalette="green" onClick={loadLatestResult}>
                      {t("taxon:name_matching.load_latest_result", {}, {
                        default: "Load my latest result"
                      })}
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`${ENDPOINT.RAW}${nameMatchingFile.filePath}`} download>
                        <LuDownload />
                        {t("taxon:name_matching.download_latest_result", {}, {
                          default: "Download"
                        })}
                      </a>
                    </Button>
                  </Flex>
                </Flex>
              )}
              {renderDropzone(
                handleProcessedFileChange,
                t("taxon:name_matching.processed_upload_description", {}, {
                  default: "Upload the processed file you received by email to view the results"
                }),
                t("taxon:name_matching.processed_upload_button", {}, {
                  default: "Upload processed file"
                })
              )}
            </Tabs.Content>
          </Tabs.Root>
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

              <Flex justifyContent="flex-end" gap={2}>
                <Button variant="outline" onClick={startOver}>
                  {t("taxon:name_matching.start_over", {}, { default: "Upload another file" })}
                </Button>
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
              <Box mb={4} width="100%">
                <Flex justifyContent="flex-end" gap={2}>
                  {activeTab == "names" && (
                    <Button
                      variant="outline"
                      colorPalette="blue"
                      onClick={setAllToUpdate}
                      disabled={updatableNames.length === 0}
                      title="Set the action to Update for every name in the current filter that can be updated"
                    >
                      {`Set all to Update (${updatableNames.length})`}
                    </Button>
                  )}
                  {activeTab != "common" && (
                    <NativeSelectRoot maxW="10rem">
                      <NativeSelectField
                        aria-label="Status filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e?.currentTarget?.value)}
                      >
                        {STATUS_FILTERS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  )}
                  <NativeSelectRoot maxW="10rem">
                    <NativeSelectField
                      aria-label="Match filter"
                      value={filter}
                      onChange={(e) => setFilter(e?.currentTarget?.value)}
                    >
                      <option value="All">{t("taxon:name_matching.all_filter")}</option>
                      <option value="Matched">{t("taxon:name_matching.matched_filter")}</option>
                      {activeTab != "common" && (
                        <option value="Single Matched">{"Single Matched"}</option>
                      )}
                      {activeTab != "common" && (
                        <option value="Multiple Matched">{"Multiple Matched"}</option>
                      )}
                      <option value="Unmatched">{t("taxon:name_matching.unmatched_filter")}</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Flex>
                <Tabs.Root
                  value={activeTab}
                  onValueChange={(details) => handleTabChange(details.value)}
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
                    <NameTable
                      key={`${filter}|${statusFilter}`}
                      finalResult={filteredNames}
                      selectedColumn={selectedColumn}
                      uploadResult={uploadResult}
                      {...rowHandlers.names}
                      getAction={getRowAction}
                      onActionChange={setRowAction}
                      canUpdate={canUpdate}
                      canCreate={canCreate}
                    />
                  </Tabs.Content>
                  <Tabs.Content value="synonyms">
                    <NameTable
                      key={`${filter}|${statusFilter}`}
                      finalResult={filteredSynonyms}
                      selectedColumn={selectedColumn}
                      uploadResult={synonymResult}
                      {...rowHandlers.synonyms}
                      synonym={true}
                    />
                  </Tabs.Content>
                  <Tabs.Content value="common">
                    <NameTable
                      key={filter}
                      finalResult={filteredCnames}
                      selectedColumn={selectedColumn}
                      uploadResult={uploadResult}
                      {...rowHandlers.common}
                      cname={true}
                    />
                  </Tabs.Content>
                  <Tabs.Content value="hierarchy">
                    <NameTable
                      key={`${filter}|${statusFilter}`}
                      finalResult={filteredHier}
                      selectedColumn={selectedColumn}
                      uploadResult={hierResult}
                      {...rowHandlers.hierarchy}
                      hierarchy={true}
                    />
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