import {
  Badge,
  Box,
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  FileUpload,
  Flex,
  Heading,
  HStack,
  Icon,
  Portal,
  Select,
  Text,
  Tooltip,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Collapsible } from "@chakra-ui/react";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import { TAXON_BADGE_COLORS } from "@static/constants";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import { Fragment, useCallback, useMemo, useState } from "react";
import {
  LuChevronDown,
  LuChevronRight,
  LuCopyCheck,
  LuMinus,
  LuPlus,
  LuRefreshCw,
  LuRepeat,
  LuTag
} from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { axBatchUpload, axUploadBatchFile } from "@/services/taxonomy.service";

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

// Options for the editable action dropdown, keyed by the row's ORIGINAL
// (incoming/computed) action — not the currently selected one — so the user
// can always switch back:
//   CREATE -> Create / No change
//   UPDATE -> Update / No change
//   NOOP   -> No change only
// "Error" is never user-selectable, only a state the row can be in.
const OPTION_CREATE = { label: "Create", value: "CREATE" };
const OPTION_UPDATE = { label: "Update", value: "UPDATE" };
const OPTION_NOOP = { label: "No change", value: "NOOP" };

const ACTION_OPTIONS_BY_BASE = {
  CREATE: createListCollection({ items: [OPTION_CREATE, OPTION_NOOP] }),
  UPDATE: createListCollection({ items: [OPTION_UPDATE, OPTION_NOOP] }),
  NOOP: createListCollection({ items: [OPTION_NOOP] })
};

function getActionOptions(baseAction: string) {
  return (
    ACTION_OPTIONS_BY_BASE[baseAction as keyof typeof ACTION_OPTIONS_BY_BASE] ??
    ACTION_OPTIONS_BY_BASE.NOOP
  );
}

type FieldChange = { field: string; oldValue: string; newValue: string };

// One row returned by axUploadBatchFile. Typed as an object (not string) so
// rows can be spread when updating state: { ...row, action: value }.
type UploadRow = {
  id?: any;
  scientificName: string;
  status: string;
  position: string;
  hierarchy?: string;
  action: string;
  // Action as it came from the server; kept once the user changes `action`
  // so the dropdown keeps offering the same options.
  originalAction?: string;
  taxonId: string | number | null;
  speciesId?: string | number | null;
  synonyms?: string[];
  commonNames?: string[];
  [key: string]: any;
};

// ---------------------------------------------------------------------------
// Shared helpers — used by both the row UI and the confirmation dialog so the
// two always agree on what's being created / updated.
// ---------------------------------------------------------------------------

// Main-row field diffs ("old#new" encoded values).
function getMainRowChanges(item: any): FieldChange[] {
  const changes: FieldChange[] = [];
  const fields: [string, string][] = [
    ["Status", "status"],
    ["Position", "position"],
    ["Name", "scientificName"]
  ];
  fields.forEach(([label, key]) => {
    const value: string = item[key] ?? "";
    if (value.includes("#")) {
      const [oldValue, newValue] = value.split("#");
      changes.push({ field: label, oldValue, newValue });
    }
  });
  return changes;
}

// A species page can only be created for rows that don't already have one.
function canCreateSpecies(item: any): boolean {
  return !item["speciesId"] || item["speciesId"] === "CREATE";
}

// Sub-row format: name|matchedId|status|...|rankName|acceptedId
// Synonyms:     CREATE (new) / UPDATE (status or accepted taxon changes) / NOOP / ERROR (no rank name)
// Common names: CREATE (new) / NOOP (already exists) — they are never updated.
function getSubRowComputedAction(it: string, synonym: boolean, acceptedId): string {
  const parts = it.split("|");
  const [, matchedId, status] = parts;

  if (!synonym) {
    return matchedId === "null" ? "CREATE" : "NOOP";
  }

  if (matchedId === "null") {
    return parts[4] == "null" ? "ERROR" : "CREATE";
  }
  return status.startsWith("#") || Number(parts[5]) !== Number(acceptedId) ? "UPDATE" : "NOOP";
}

function getSubRowChanges(it: string, synonym: boolean, acceptedId): FieldChange[] {
  // Common names are only ever created or left as-is, so there's no diff.
  if (!synonym) return [];
  const parts = it.split("|");
  const status = parts[2] ?? "";
  const changes: FieldChange[] = [];
  if (status.startsWith("#")) {
    changes.push({ field: "Status", oldValue: "ACCEPTED", newValue: "SYNONYM" });
  }
  if (synonym && Number(parts[5]) !== Number(acceptedId)) {
    changes.push({ field: "AcceptedId", oldValue: parts[5], newValue: String(acceptedId) });
  }
  return changes;
}

// "N changes" trigger that reveals the field-level diff on hover/focus.
// Shared by the main-row dropdown and the read-only sub-row badge.
function ChangesTooltip({ changes }: { changes: FieldChange[] }) {
  return (
    <Tooltip.Root
      openDelay={150}
      interactive
      positioning={{ placement: "bottom-end", overflowPadding: 8 }}
    >
      <Tooltip.Trigger asChild>
        <HStack
          as="button"
          gap={1}
          fontSize="xs"
          color="gray.500"
          cursor="default"
          flexShrink={0}
        >
          <Icon as={LuChevronRight} boxSize={3} />
          {changes!.length} change{changes!.length !== 1 ? "s" : ""}
        </HStack>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        {/* Width follows the screen on small devices and is capped on larger
            ones; long values wrap, and very long lists scroll. */}
        <Tooltip.Content
          maxW={{ base: "calc(100vw - 16px)", sm: "360px" }}
          maxH="60vh"
          overflowY="auto"
          px={3}
          py={2}
        >
          <VStack align="stretch" gap={2}>
            {changes!.map((change, i) => (
              <Box key={i} fontSize="xs" minW={0}>
                <Text color="gray.300" fontWeight="semibold" mb={0.5}>
                  {change.field}
                </Text>
                <Flex wrap="wrap" align="center" columnGap={1.5} rowGap={0.5} minW={0}>
                  <Text
                    color="gray.400"
                    textDecoration="line-through"
                    wordBreak="break-word"
                    overflowWrap="anywhere"
                    minW={0}
                  >
                    {change.oldValue || "—"}
                  </Text>
                  <Icon as={LuChevronRight} boxSize={3} color="gray.400" flexShrink={0} />
                  <Text
                    color="green.300"
                    fontWeight="medium"
                    wordBreak="break-word"
                    overflowWrap="anywhere"
                    minW={0}
                  >
                    {change.newValue || "—"}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}

// Read-only action indicator for synonyms and common names. Same badge look
// as ACTION_BADGE everywhere; UPDATE rows also show the "N changes" diff,
// and ERROR rows show the reason next to the badge.
function ActionBadge({
  action,
  changes,
  error
}: {
  action: string;
  changes?: FieldChange[];
  error?: string;
}) {
  const config = ACTION_BADGE[action] ?? ACTION_BADGE.NOOP;
  const hasChanges = action === "UPDATE" && changes && changes.length > 0;

  return (
    <HStack gap={2} flexShrink={0}>
      {action === "ERROR" && error && (
        <Text fontSize="xs" color="red.500" whiteSpace="normal" textAlign="right">
          {error}
        </Text>
      )}
      {hasChanges && <ChangesTooltip changes={changes!} />}
      <Badge colorPalette={config.colorPalette} size="sm">
        <Icon as={config.icon} boxSize={3} />
        {config.label}
      </Badge>
    </HStack>
  );
}

// Editable action control for a main row: a dropdown pre-selected to the
// incoming action (CREATE / UPDATE / NOOP) that the user can change,
// unless the row is in an error state — then it's replaced by a
// disabled control plus the error reason. Hovering the change count
// (when the incoming action is UPDATE) reveals the field-level diff.
function ActionDropdown({
  action,
  baseAction,
  changes,
  error,
  onChange
}: {
  action: string;
  // The row's original action; decides which options are offered.
  baseAction: string;
  changes?: FieldChange[];
  error?: string;
  onChange: (value: string) => void;
}) {
  const isError = action === "ERROR";
  const hasChanges = action === "UPDATE" && changes && changes.length > 0;
  const options = getActionOptions(baseAction);
  const onlyOneOption = options.items.length <= 1;

  if (isError) {
    return (
      <HStack gap={2}>
        <Text fontSize="xs" color="red.500" whiteSpace="normal" textAlign="right">
          {error}
        </Text>
        <Select.Root
          collection={ACTION_OPTIONS_BY_BASE.NOOP}
          value={[]}
          disabled
          size="sm"
          width="130px"
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Error" />
            </Select.Trigger>
          </Select.Control>
        </Select.Root>
      </HStack>
    );
  }

  return (
    <HStack gap={2}>
      {hasChanges && (
        <ChangesTooltip changes={changes!} />
      )}

      <Select.Root
        collection={options}
        value={[action]}
        onValueChange={(e) => onChange(e.value[0])}
        disabled={onlyOneOption}
        size="sm"
        width="130px"
      >
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {options.items.map((opt) => (
                <Select.Item key={opt.value} item={opt}>
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </HStack>
  );
}

function SubRowGroup({
  label,
  icon,
  items,
  synonym,
  acceptedId
}: {
  label: string;
  icon: any;
  items: string[];
  synonym: boolean;
  acceptedId;
}) {
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
            const [name, , status] = it.split("|");
            const action = getSubRowComputedAction(it, synonym, acceptedId);
            const changes = getSubRowChanges(it, synonym, acceptedId);
            return (
              <HStack key={i} justify="space-between" py={1.5} fontSize="small">
                <Text>
                  {name}
                  {synonym && (
                    <Box>
                      <Badge
                        mr={2}
                        colorPalette={
                          TAXON_BADGE_COLORS[status.startsWith("#") ? status.slice(1) : status]
                        }
                      >
                        {status.startsWith("#") ? status.slice(1) : status}
                      </Badge>
                    </Box>
                  )}
                </Text>
                <ActionBadge
                  action={action}
                  changes={changes}
                  error={action == "ERROR" ? "Cannot create synonym without rank name" : undefined}
                />
              </HStack>
            );
          })}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

type ChangeSummary = {
  namesCreate: number;
  namesUpdate: number;
  synonymsCreate: number;
  synonymsUpdate: number;
  commonNamesCreate: number;
  speciesCreate: number;
};

// Responsive replacement for window.confirm: full width on small screens,
// capped width on larger ones, body scrolls instead of overflowing, and long
// text wraps instead of stretching the dialog.
function ConfirmUploadDialog({
  open,
  onOpenChange,
  summary,
  isSubmitting,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: ChangeSummary | null;
  isSubmitting: boolean;
  onConfirm: () => void;
}) {
  const rows: { label: string; create?: number; update?: number }[] = summary
    ? [
        { label: "Names", create: summary.namesCreate, update: summary.namesUpdate },
        { label: "Species pages", create: summary.speciesCreate },
        { label: "Synonyms", create: summary.synonymsCreate, update: summary.synonymsUpdate },
        { label: "Common names", create: summary.commonNamesCreate }
      ]
    : [];

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !isSubmitting && onOpenChange(e.open)}
      placement="center"
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px={{ base: 3, sm: 4 }}>
          <Dialog.Content
            width="full"
            maxW={{ base: "100%", sm: "md" }}
            maxH={{ base: "90vh", md: "80vh" }}
          >
            <Dialog.Header>
              <Dialog.Title fontSize={{ base: "md", sm: "lg" }}>Confirm batch upload</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text fontSize="sm" color="gray.600" mb={3} wordBreak="break-word">
                This action will make the following changes:
              </Text>

              <VStack align="stretch" gap={0} borderWidth="1px" borderRadius="md" overflow="hidden">
                <HStack
                  px={3}
                  py={2}
                  bg="gray.50"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                >
                  <Text flex="1" minW={0}>
                    Type
                  </Text>
                  <Text w={{ base: "56px", sm: "72px" }} textAlign="right">
                    Create
                  </Text>
                  <Text w={{ base: "56px", sm: "72px" }} textAlign="right">
                    Update
                  </Text>
                </HStack>
                {rows.map((row) => (
                  <HStack key={row.label} px={3} py={2} borderTopWidth="1px" fontSize="sm">
                    <Text flex="1" minW={0} wordBreak="break-word">
                      {row.label}
                    </Text>
                    <Text
                      w={{ base: "56px", sm: "72px" }}
                      textAlign="right"
                      color={row.create ? "green.600" : "gray.400"}
                      fontWeight={row.create ? "semibold" : "normal"}
                    >
                      {row.create ?? "—"}
                    </Text>
                    <Text
                      w={{ base: "56px", sm: "72px" }}
                      textAlign="right"
                      color={row.update ? "blue.600" : "gray.400"}
                      fontWeight={row.update ? "semibold" : "normal"}
                    >
                      {row.update ?? "—"}
                    </Text>
                  </HStack>
                ))}
              </VStack>

              <Text fontSize="sm" mt={4}>
                Are you sure you want to proceed?
              </Text>
            </Dialog.Body>

            <Dialog.Footer
              flexDirection={{ base: "column-reverse", sm: "row" }}
              gap={2}
              alignItems="stretch"
              justifyContent="flex-end"
            >
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  width={{ base: "full", sm: "auto" }}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="blue"
                onClick={onConfirm}
                loading={isSubmitting}
                width={{ base: "full", sm: "auto" }}
              >
                Confirm
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" disabled={isSubmitting} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default function TaxonomyBatchUploadComponent() {
  const [uploadResult, setUploadResult] = useState<UploadRow[]>([]);
  const [excludedIds, setExcludedIds] = useState<Set<bigint>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Single source of truth for "will a species page be created for this row?"
  // - Select All mode: every eligible row is selected unless its id is in excludedIds.
  // - Normal mode: selected when the row's speciesId is "CREATE".
  const isSpeciesSelected = useCallback(
    (item: any) => {
      if (!canCreateSpecies(item)) return false;
      return selectAll ? !excludedIds.has(item["id"]) : item["speciesId"] === "CREATE";
    },
    [selectAll, excludedIds]
  );

  // Counts of what will be created / updated. Respects user overrides on sub-rows.
  const getChangeSummary = useCallback(() => {
    let namesCreate = 0;
    let namesUpdate = 0;
    let synonymsCreate = 0;
    let synonymsUpdate = 0;
    let commonNamesCreate = 0;
    let speciesCreate = 0;

    uploadResult.forEach((item: any) => {
      if (item["action"] === "CREATE") namesCreate++;
      if (item["action"] === "UPDATE") namesUpdate++;
      // Only rows that are actually submitted (not ERROR) can create a species page.
      if (item["action"] !== "ERROR" && isSpeciesSelected(item)) speciesCreate++;

      (item["synonyms"] || []).forEach((syn: string) => {
        const action = getSubRowComputedAction(syn, true, item["taxonId"]);
        if (action === "CREATE") synonymsCreate++;
        if (action === "UPDATE") synonymsUpdate++;
      });

      (item["commonNames"] || []).forEach((cn: string) => {
        const action = getSubRowComputedAction(cn, false, item["taxonId"]);
        if (action === "CREATE") commonNamesCreate++;
      });
    });

    return {
      namesCreate,
      namesUpdate,
      synonymsCreate,
      synonymsUpdate,
      commonNamesCreate,
      speciesCreate
    };
  }, [uploadResult, isSpeciesSelected]);

  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [, setFile] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const changeSummary = useMemo(
    () => (confirmOpen ? getChangeSummary() : null),
    [confirmOpen, getChangeSummary]
  );
  const { onOpen: onOpen1 } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(1);

  const { t } = useTranslation();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const targetFile = details.acceptedFiles[0];

      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification(t("traits:trait_matching.excel_file_error"));
        return;
      }

      if (targetFile) {
        try {
          const formData = new FormData();
          formData.append("file", targetFile);

          const { success, data } = await axUploadBatchFile(formData);
          if (success) {
            setUploadResult(data);
            setCurrentStep(2);
          }
        } catch (error) {
          console.error(t("traits:trait_matching.excel_file_error"), error);
        }
      } else {
        alert(t("traits:trait_matching.no_file_error"));
      }
    },
    [onOpen1, t]
  );

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
        taxonId: item["taxonId"],
        speciesId: canCreateSpecies(item)
          ? isSpeciesSelected(item)
            ? "CREATE"
            : null
          : item["speciesId"]
      }));
  }, [uploadResult, isSpeciesSelected]);

  async function handleSubmit() {
    const payload = buildAcceptedPayload();
    setIsSubmitting(true);

    try {
      const { success } = await axBatchUpload(payload);
      if (success) {
        notification("Taxonomy created successfully", NotificationType.Success);
        setConfirmOpen(false);
        setCurrentStep(1);
        setUploadResult([]);
        setFile(null);
      } else {
        notification("Error while creating taxonomy");
      }
    } catch (error) {
      notification("Error while creating taxonomy");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box p={4}>
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        {t("taxon:batch_upload.description")}
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

      {currentStep == 2 && (
        <>
          <Box mb={4}>
            <Box mb={4} width="100%">
              <Button
                variant={"outline"}
                size="xs"
                colorPalette="blue"
                onClick={() => {
                  setSelectAll(true);
                }}
              >
                <LuCopyCheck />
                Select All
              </Button>
              <VStack align="stretch" gap={3}>
                {uploadResult &&
                  uploadResult.map((item, index) => {
                    const hierarchyNodes = item["hierarchy"]?.split(";").filter(Boolean) ?? [];
                    const changes = getMainRowChanges(item);

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
                            <Text fontWeight="medium">
                              {canCreateSpecies(item) && (
                                <Checkbox
                                  mr={2}
                                  checked={isSpeciesSelected(item)}
                                  onCheckedChange={() => {
                                    if (selectAll) {
                                      setExcludedIds((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(item["id"])) {
                                          next.delete(item["id"]);
                                        } else {
                                          next.add(item["id"]);
                                        }
                                        return next;
                                      });
                                    } else {
                                      setUploadResult((prev) =>
                                        prev.map((row, i) =>
                                          i === index
                                            ? {
                                                ...row,
                                                speciesId:
                                                  row["speciesId"] === "CREATE" ? null : "CREATE"
                                              }
                                            : row
                                        )
                                      );
                                    }
                                  }}
                                  colorPalette="blue"
                                  aria-label={`Select ${item["scientificName"]} for page creation`}
                                />
                              )}
                              {item["scientificName"].split("#")[0]}{" "}
                              <Badge
                                mr={2}
                                colorPalette={TAXON_BADGE_COLORS[item["status"].split("#")[0]]}
                              >
                                {item["status"].split("#")[0]}
                              </Badge>
                              <Badge
                                colorPalette={TAXON_BADGE_COLORS[item["position"].split("#")[0]]}
                              >
                                {item["position"].split("#")[0]}
                              </Badge>
                            </Text>
                          </Box>
                          <HStack gap={1.5} flexShrink={0}>
                            <ActionDropdown
                              action={item["action"]}
                              baseAction={item["originalAction"] ?? item["action"]}
                              changes={changes}
                              error={
                                item["error"]
                              }
                              onChange={(value) => {
                                setUploadResult((prev) =>
                                  prev.map((row, i) =>
                                    i === index
                                      ? {
                                          ...row,
                                          originalAction: row["originalAction"] ?? row["action"],
                                          action: value
                                        }
                                      : row
                                  )
                                );
                              }}
                            />
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
                          <SubRowGroup
                            label="Synonyms"
                            icon={LuRepeat}
                            items={item["synonyms"]}
                            synonym={true}
                            acceptedId={item["taxonId"]}
                          />
                        )}
                        {item["commonNames"] && item["commonNames"].length > 0 && (
                          <SubRowGroup
                            label="Common names"
                            icon={LuTag}
                            items={item["commonNames"]}
                            synonym={false}
                            acceptedId={item["taxonId"]}
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
                  onClick={() => setConfirmOpen(true)}
                  disabled={!termsAccepted}
                  width={{ base: "full", sm: "auto" }}
                >
                  {t("traits:trait_matching.batch_upload")}
                </Button>
              </Flex>

              <ConfirmUploadDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                summary={changeSummary}
                isSubmitting={isSubmitting}
                onConfirm={handleSubmit}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}