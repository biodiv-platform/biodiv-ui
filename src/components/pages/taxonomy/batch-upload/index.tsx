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
  LuArrowRight,
  LuChevronDown,
  LuChevronRight,
  LuCopyCheck,
  LuFileCheck,
  LuFilePlus,
  LuMinus,
  LuPlus,
  LuRefreshCw,
  LuRepeat,
  LuStar,
  LuTag
} from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { axBatchUpload, axUploadBatchFile } from "@/services/taxonomy.service";

const ACCEPT_STRING =
  "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Central mapping so the action badge looks identical everywhere it's used
// (main row, synonyms, common names, confirm dialog).
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
  synonyms?: string[] | null;
  commonNames?: string[] | null;
  // taxonId -> new hierarchy string ("rank:Name#id;rank:Name#id;...")
  updateHier?: Record<string, string> | null;
  // Position changes on taxa in the row's hierarchy: "Name|id|OLD#NEW"
  positionHier?: string[] | null;
  [key: string]: any;
};

// One parsed positionHier entry. `raw` is the original string, sent back as-is.
type PositionChange = {
  id: string;
  name: string;
  oldValue: string;
  newValue: string;
  raw: string;
};

type HierarchyNode = { rank: string; name: string; id: string };

// One entry per updateHier key. The last node is the taxon being moved;
// the rest is its new parent path.
type HierarchyUpdate = {
  id: string;
  action: string;
  target: HierarchyNode;
  parents: HierarchyNode[];
};

// ---------------------------------------------------------------------------
// Shared helpers — used by both the row UI, the confirmation dialog and the
// submit payload so they always agree on what's being created / updated.
// ---------------------------------------------------------------------------

// "rank:Name#id;rank:Name#id" -> nodes. Handles null and the literal "null".
function parseHierarchy(hier?: string | null): HierarchyNode[] {
  if (!hier || hier === "null") return [];
  return hier
    .split(";")
    .filter(Boolean)
    .map((node) => {
      const colon = node.indexOf(":");
      const rank = colon === -1 ? "" : node.slice(0, colon);
      const rest = colon === -1 ? node : node.slice(colon + 1);
      const hash = rest.lastIndexOf("#");
      return hash === -1
        ? { rank, name: rest, id: "" }
        : { rank, name: rest.slice(0, hash), id: rest.slice(hash + 1) };
    });
}

// Rows that will actually be submitted as a change (respects the dropdown).
const isSubmittedChange = (r: UploadRow) => r.action === "CREATE" || r.action === "UPDATE";

// taxonId -> index of the latest row that updates its hierarchy.
// Rows switched to "No change" or in ERROR don't count, and neither do
// empty / "null" hierarchy strings, so they can't shadow a real update.
function getLatestHierOwners(rows: UploadRow[]): Map<string, number> {
  const owners = new Map<string, number>();
  rows.forEach((r, rowIndex) => {
    if (!isSubmittedChange(r) || !r.updateHier) return;
    Object.entries(r.updateHier).forEach(([id, hier]) => {
      if (parseHierarchy(hier).length > 0) owners.set(id, rowIndex);
    });
  });
  return owners;
}

// The row's updateHier with only the entries this row is the latest owner of.
// Older rows that touched the same taxon drop that entry.
function getLatestUpdateHier(
  row: UploadRow,
  rowIndex: number,
  owners: Map<string, number>
): Record<string, string> | null {
  if (!isSubmittedChange(row) || !row.updateHier) return null;
  const entries = Object.entries(row.updateHier).filter(([id]) => owners.get(id) === rowIndex);
  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

// Hierarchy updates shown in the confirm dialog — exactly what will be sent.
function getHierarchyUpdates(rows: UploadRow[]): HierarchyUpdate[] {
  const owners = getLatestHierOwners(rows);
  return rows.flatMap((r, rowIndex) =>
    Object.entries(getLatestUpdateHier(r, rowIndex, owners) ?? {}).map(([id, hier]) => {
      const nodes = parseHierarchy(hier);
      return {
        id,
        action: r.action,
        target: nodes[nodes.length - 1],
        parents: nodes.slice(0, -1)
      };
    })
  );
}

// "164709.0" and "164709" refer to the same taxon.
function normId(id: any): string {
  const s = String(id ?? "").trim();
  const n = Number(s);
  return s !== "" && Number.isFinite(n) ? String(n) : s;
}

// "Proboscidea|164709|WORKING#RAW" -> { name, id, oldValue, newValue }.
// Entries without an "old#new" position aren't changes and are skipped.
function parsePositionHier(entry: string): PositionChange | null {
  const parts = entry.split("|");
  if (parts.length < 3) return null;
  const position = parts[parts.length - 1];
  if (!position.includes("#")) return null;
  const [oldValue, newValue] = position.split("#");
  return {
    id: normId(parts[parts.length - 2]),
    name: parts.slice(0, -2).join("|"),
    oldValue,
    newValue,
    raw: entry
  };
}

// Position changes for one row. Errored rows aren't submitted, so they have none.
function getRowPositionChanges(row: UploadRow): PositionChange[] {
  if (row.action === "ERROR") return [];
  return (row.positionHier ?? [])
    .map(parsePositionHier)
    .filter((c): c is PositionChange => c !== null);
}

// taxonId -> index of the latest row that changes its position. Several rows
// can share an ancestor (e.g. same order), so only one of them sends it.
function getLatestPositionOwners(rows: UploadRow[]): Map<string, number> {
  const owners = new Map<string, number>();
  rows.forEach((r, rowIndex) => {
    getRowPositionChanges(r).forEach((c) => owners.set(c.id, rowIndex));
  });
  return owners;
}

// The row's position changes that this row is the latest owner of (deduped by id).
function getOwnedPositionChanges(
  row: UploadRow,
  rowIndex: number,
  owners: Map<string, number>
): PositionChange[] {
  const seen = new Set<string>();
  return getRowPositionChanges(row).filter((c) => {
    if (owners.get(c.id) !== rowIndex || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

// Position updates shown in the confirm dialog — exactly what will be sent.
function getPositionUpdates(rows: UploadRow[]): PositionChange[] {
  const owners = getLatestPositionOwners(rows);
  return rows.flatMap((r, rowIndex) => getOwnedPositionChanges(r, rowIndex, owners));
}

// Main-row field diffs ("old#new" encoded values).
function getMainRowChanges(item: any): FieldChange[] {
  const changes: FieldChange[] = [];
  const fields: [string, string][] = [
    ["Status", "status"],
    ["Position", "position"],
    ["Name", "scientificName"],
    ["AcceptedId", "acceptedId"]
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

function CountBubble({
  count,
  colorPalette,
  icon,
  label
}: {
  count: number;
  colorPalette: string;
  icon: any;
  label: string;
}) {
  if (!count) return null;
  return (
    <Badge
      colorPalette={colorPalette}
      variant="solid"
      size="xs"
      borderRadius="full"
      px={1.5}
      minW={4}
      justifyContent="center"
      title={`${count} to ${label}`}
      aria-label={`${count} to ${label}`}
    >
      <Icon as={icon} boxSize={2.5} />
      {count}
    </Badge>
  );
}

// Synonym format:     name|matchedId|status|position|rankName|acceptedId
//   status:   "SYNONYM", or "#SYNONYM" when an accepted name becomes a synonym
//   position: "WORKING", or "RAW#WORKING" (old#new) when the position changes
// Common name format: name|matchedId|language|preferred
//   preferred: "true" / "false" (may be "null" or missing)
// Synonyms:     CREATE (new) / UPDATE (status, position or accepted taxon changes) / NOOP / ERROR (no rank name)
// Common names: CREATE (new) / NOOP (already exists) — they are never updated.
function getSubRowComputedAction(it: string, synonym: boolean, acceptedId): string {
  const parts = it.split("|");
  const [, matchedId, status] = parts;

  if (!synonym) {
    return matchedId === "CREATE" ? "CREATE" : "NOOP";
  }

  if (matchedId === "CREATE") {
    return parts[4] == "null" ? "ERROR" : "CREATE";
  }
  const positionChanged = (parts[3] ?? "").includes("#");
  return status.startsWith("#") || positionChanged || Number(parts[5]) !== Number(acceptedId)
    ? "UPDATE"
    : "NOOP";
}

function getSubRowChanges(it: string, synonym: boolean, acceptedId): FieldChange[] {
  // Common names are only ever created or left as-is, so there's no diff.
  if (!synonym) return [];
  const parts = it.split("|");
  const status = parts[2] ?? "";
  const position = parts[3] ?? "";
  const changes: FieldChange[] = [];
  if (status.startsWith("#")) {
    changes.push({ field: "Status", oldValue: "ACCEPTED", newValue: "SYNONYM" });
  }
  if (position.includes("#")) {
    const [oldValue, newValue] = position.split("#");
    changes.push({ field: "Position", oldValue, newValue });
  }
  if (synonym && Number(parts[5]) !== Number(acceptedId)) {
    changes.push({ field: "AcceptedId", oldValue: parts[5], newValue: String(acceptedId) });
  }
  return changes;
}

// Finds the diff for one field, or undefined when that field isn't changing.
function findChange(changes: FieldChange[], field: string): FieldChange | undefined {
  return changes.find((c) => c.field === field);
}

// A tag that shows its value, or — when `change` is given — the change itself
// inside the tag: "ACCEPTED → SYNONYM", with the old value struck through.
// Status / position tags take their colour from TAXON_BADGE_COLORS (using the
// new value when it changes); labelled tags like "Accepted ID" stay gray.
function ValueBadge({
  value,
  change,
  label
}: {
  value?: string;
  change?: FieldChange;
  label?: string;
}) {
  const shown = change ? change.newValue : value;
  const colorPalette = label ? "gray" : TAXON_BADGE_COLORS[shown ?? ""];

  return (
    <Badge
      colorPalette={colorPalette}
      mr={2}
      maxW="full"
      whiteSpace="normal"
      overflowWrap="anywhere"
      borderWidth={change ? "1px" : undefined}
      borderStyle={change ? "dashed" : undefined}
      borderColor={change ? "currentColor" : undefined}
      title={change ? `${change.field}: ${change.oldValue || "—"} → ${change.newValue || "—"}` : undefined}
    >
      {label && (
        <Text as="span" fontWeight="normal" opacity={0.8}>
          {label}
        </Text>
      )}
      {change && (
        <>
          <Text as="span" textDecoration="line-through" opacity={0.6}>
            {change.oldValue || "—"}
          </Text>
          <Icon as={LuArrowRight} boxSize={3} flexShrink={0} />
        </>
      )}
      {shown || "—"}
    </Badge>
  );
}

// Read-only action indicator for synonyms and common names. Same badge look
// as ACTION_BADGE everywhere; ERROR rows show the reason next to the badge.
// Field changes are shown inside the row's own tags (see <ValueBadge />).
function ActionBadge({ action, error }: { action: string; error?: string }) {
  const config = ACTION_BADGE[action] ?? ACTION_BADGE.NOOP;

  return (
    <HStack gap={2} flexShrink={0}>
      {action === "ERROR" && error && (
        <Text fontSize="xs" color="red.500" whiteSpace="normal" textAlign="right">
          {error}
        </Text>
      )}
      <Badge colorPalette={config.colorPalette} size="sm">
        <Icon as={config.icon} boxSize={3} />
        {config.label}
      </Badge>
    </HStack>
  );
}

// Explicit, labelled control for "create a species page for this name".
// Rows that already have a page show a read-only badge instead; errored
// rows are never submitted, so their toggle is disabled with the reason.
function SpeciesPageToggle({
  item,
  checked,
  onToggle
}: {
  item: UploadRow;
  checked: boolean;
  onToggle: () => void;
}) {
  if (!canCreateSpecies(item)) {
    return (
      <Badge colorPalette="gray" variant="subtle" size="sm">
        <Icon as={LuFileCheck} boxSize={3} />
        Species page exists
      </Badge>
    );
  }

  const disabled = item.action === "ERROR";
  const isOn = checked && !disabled;

  return (
    <Box
      display="inline-flex"
      borderWidth="1px"
      borderRadius="md"
      px={2}
      py={1}
      borderColor={isOn ? "blue.300" : "gray.200"}
      bg={isOn ? "blue.50" : undefined}
      opacity={disabled ? 0.6 : 1}
      title={disabled ? "Species page can't be created: this name has an error" : undefined}
    >
      <Checkbox
        size="sm"
        colorPalette="blue"
        checked={isOn}
        disabled={disabled}
        onCheckedChange={onToggle}
        aria-label={`Create species page for ${item.scientificName.split("#")[0]}`}
      >
        <HStack gap={1}>
          <Icon as={LuFilePlus} boxSize={3.5} color={isOn ? "blue.600" : "gray.500"} />
          <Text fontSize="sm">Create species page</Text>
        </HStack>
      </Checkbox>
    </Box>
  );
}

// Editable action control for a main row: a dropdown pre-selected to the
// incoming action (CREATE / UPDATE / NOOP) that the user can change,
// unless the row is in an error state — then it's replaced by a
// disabled control plus the error reason.
function ActionDropdown({
  action,
  baseAction,
  error,
  onChange
}: {
  action: string;
  // The row's original action; decides which options are offered.
  baseAction: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const isError = action === "ERROR";
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

// Action + error reason for a sub-row, taking the parent name into account.
// If the parent name is in an ERROR state, anything that would have been
// created or updated becomes an ERROR instead (it won't be submitted).
function getSubRowState(
  it: string,
  synonym: boolean,
  acceptedId,
  parentError: boolean
): { action: string; error?: string } {
  const computed = getSubRowComputedAction(it, synonym, acceptedId);
  const kind = synonym ? "synonym" : "common name";

  if (parentError && (computed === "CREATE" || computed === "UPDATE")) {
    const verb = computed === "CREATE" ? "create" : "update";
    return { action: "ERROR", error: `Cannot ${verb} ${kind}: given name has an error` };
  }
  if (computed === "ERROR") {
    return { action: "ERROR", error: "Cannot create synonym without rank name" };
  }
  return { action: computed };
}

function SubRowGroup({
  label,
  icon,
  items,
  synonym,
  acceptedId,
  parentError = false
}: {
  label: string;
  icon: any;
  items: string[];
  synonym: boolean;
  acceptedId;
  // True when the given (main) name is in an ERROR state.
  parentError?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const counts = useMemo(() => {
    let create = 0;
    let update = 0;
    let error = 0;
    items.forEach((it) => {
      const { action } = getSubRowState(it, synonym, acceptedId, parentError);
      if (action === "CREATE") create++;
      else if (action === "UPDATE") update++;
      else if (action === "ERROR") error++;
    });
    return { create, update, error };
  }, [items, synonym, acceptedId, parentError]);

  return (
    <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Collapsible.Trigger asChild>
        <HStack gap={1} fontSize="xs" color="blue.600" cursor="pointer" mt={1}>
          <Icon as={icon} boxSize={3} />
          <Text>
            {label} ({items.length})
          </Text>
          <CountBubble count={counts.create} colorPalette="green" icon={LuPlus} label="create" />
          {/* Common names are never updated, so this only ever shows for synonyms */}
          <CountBubble
            count={counts.update}
            colorPalette="blue"
            icon={LuRefreshCw}
            label="update"
          />
          <CountBubble
            count={counts.error}
            colorPalette="red"
            icon={ACTION_BADGE.ERROR.icon}
            label="fail"
          />
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
            const [name, , status, rawPosition] = it.split("|");
            // Common names: 4th field is the preferred flag.
            const isPreferred = !synonym && (rawPosition ?? "").trim().toLowerCase() === "true";
            const { action, error } = getSubRowState(it, synonym, acceptedId, parentError);
            // Only show changes inside the tags when they'll actually be applied.
            const changes =
              action === "UPDATE" ? getSubRowChanges(it, synonym, acceptedId) : [];
            const statusChange = findChange(changes, "Status");
            const positionChange = findChange(changes, "Position");
            const acceptedIdChange = findChange(changes, "AcceptedId");
            // Without an applied change, show the current (old) position.
            const position =
              rawPosition && rawPosition !== "null" ? rawPosition.split("#")[0] : "";
            return (
              <HStack key={i} justify="space-between" align="flex-start" gap={2} py={1.5} fontSize="small">
                <Text minW={0} wordBreak="break-word">
                  {name}
                  {synonym && (
                    <Box>
                      <ValueBadge
                        value={status.startsWith("#") ? status.slice(1) : status}
                        change={statusChange}
                      />
                      {(position || positionChange) && (
                        <ValueBadge value={position} change={positionChange} />
                      )}
                      {acceptedIdChange && (
                        <ValueBadge label="Accepted ID" change={acceptedIdChange} />
                      )}
                    </Box>
                  )}
                  {isPreferred && (
                    <Box>
                      <Badge colorPalette="yellow" mr={2}>
                        <Icon as={LuStar} boxSize={3} />
                        Preferred
                      </Badge>
                    </Box>
                  )}
                </Text>
                <ActionBadge action={action} error={error} />
              </HStack>
            );
          })}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// Breadcrumb of the new parent path; hovering a node shows its rank and id.
function HierarchyBreadcrumb({ nodes }: { nodes: HierarchyNode[] }) {
  return (
    <Flex wrap="wrap" align="center" columnGap={1} rowGap={0.5} fontSize="xs" color="gray.500">
      {nodes.map((n, j, arr) => (
        <Fragment key={j}>
          <Text
            as="span"
            title={`${n.rank}: ${n.name}${n.id ? ` #${n.id}` : ""}`}
            overflowWrap="anywhere"
          >
            {n.name}
          </Text>
          {j < arr.length - 1 && <Icon as={LuChevronRight} boxSize={3} flexShrink={0} />}
        </Fragment>
      ))}
    </Flex>
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
  hierarchyUpdates,
  positionUpdates,
  isSubmitting,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: ChangeSummary | null;
  hierarchyUpdates: HierarchyUpdate[];
  positionUpdates: PositionChange[];
  isSubmitting: boolean;
  onConfirm: () => void;
}) {
  const rows: { label: string; create?: number; update?: number }[] = summary
    ? [
        { label: "Names", create: summary.namesCreate, update: summary.namesUpdate },
        { label: "Species pages", create: summary.speciesCreate },
        { label: "Synonyms", create: summary.synonymsCreate, update: summary.synonymsUpdate },
        { label: "Common names", create: summary.commonNamesCreate },
        { label: "Hierarchy positions", update: positionUpdates.length }
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

              {hierarchyUpdates.length > 0 && (
                <Box mt={4}>
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Hierarchy updates ({hierarchyUpdates.length})
                  </Text>
                  <VStack align="stretch" gap={2}>
                    {hierarchyUpdates.map((u) => {
                      const badge = ACTION_BADGE[u.action] ?? ACTION_BADGE.NOOP;
                      return (
                        <Box key={u.id} borderWidth="1px" borderRadius="md" px={3} py={2}>
                          <HStack justify="space-between" align="flex-start" gap={2} mb={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              minW={0}
                              wordBreak="break-word"
                              title={`${u.target.rank}: ${u.target.name}${
                                u.target.id ? ` #${u.target.id}` : ""
                              }`}
                            >
                              {u.target.name}
                              {u.target.rank && (
                                <Text as="span" ml={1.5} fontSize="xs" color="gray.500">
                                  ({u.target.rank})
                                </Text>
                              )}
                            </Text>
                            <Badge colorPalette={badge.colorPalette} size="sm" flexShrink={0}>
                              <Icon as={badge.icon} boxSize={3} />
                              {badge.label}
                            </Badge>
                          </HStack>
                          {u.parents.length > 0 && <HierarchyBreadcrumb nodes={u.parents} />}
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>
              )}

              {positionUpdates.length > 0 && (
                <Box mt={4}>
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Position updates ({positionUpdates.length})
                  </Text>
                  <VStack align="stretch" gap={2}>
                    {positionUpdates.map((p) => (
                      <HStack
                        key={p.id}
                        justify="space-between"
                        align="flex-start"
                        gap={2}
                        borderWidth="1px"
                        borderRadius="md"
                        px={3}
                        py={2}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          minW={0}
                          wordBreak="break-word"
                        >
                          {p.name}
                        </Text>
                        <Box flexShrink={0}>
                          <ValueBadge
                            change={{
                              field: "Position",
                              oldValue: p.oldValue,
                              newValue: p.newValue
                            }}
                          />
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

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

  // Toggles species page creation for one row, in whichever mode is active.
  const toggleSpecies = useCallback(
    (index: number, id: any) => {
      if (selectAll) {
        setExcludedIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      } else {
        setUploadResult((prev) =>
          prev.map((row, i) =>
            i === index
              ? { ...row, speciesId: row["speciesId"] === "CREATE" ? null : "CREATE" }
              : row
          )
        );
      }
    },
    [selectAll]
  );

  // Rows that could get a species page (no page yet, not in error) and how
  // many of them are currently selected — shown in the toolbar.
  const speciesEligible = useMemo(
    () => uploadResult.filter((r) => canCreateSpecies(r) && r.action !== "ERROR"),
    [uploadResult]
  );
  const speciesSelectedCount = useMemo(
    () => speciesEligible.filter(isSpeciesSelected).length,
    [speciesEligible, isSpeciesSelected]
  );

  // Counts of what will be created / updated. Respects user overrides on sub-rows.
  // Names in an ERROR state are not submitted (see buildAcceptedPayload), so
  // nothing tied to them — species page, synonyms, common names — is counted.
  const getChangeSummary = useCallback(() => {
    let namesCreate = 0;
    let namesUpdate = 0;
    let synonymsCreate = 0;
    let synonymsUpdate = 0;
    let commonNamesCreate = 0;
    let speciesCreate = 0;

    uploadResult.forEach((item: any) => {
      // Skip errored names entirely: no species page, synonyms or common names.
      if (item["action"] === "ERROR") return;

      if (item["action"] === "CREATE") namesCreate++;
      if (item["action"] === "UPDATE") namesUpdate++;
      if (isSpeciesSelected(item)) speciesCreate++;

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
  const hierarchyUpdates = useMemo(
    () => (confirmOpen ? getHierarchyUpdates(uploadResult) : []),
    [confirmOpen, uploadResult]
  );
  const positionUpdates = useMemo(
    () => (confirmOpen ? getPositionUpdates(uploadResult) : []),
    [confirmOpen, uploadResult]
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
    // Computed over ALL rows (before filtering) so indexes line up.
    const owners = getLatestHierOwners(uploadResult);
    const positionOwners = getLatestPositionOwners(uploadResult);

    return uploadResult
      .map((item, rowIndex) => ({ item, rowIndex }))
      .filter(
        ({ item }) =>
          item["action"] === "CREATE" || item["action"] === "NOOP" || item["action"] === "UPDATE"
      )
      .map(({ item, rowIndex }) => ({
        scientificName: item["scientificName"],
        status: item["status"],
        position: item["position"],
        hierarchy: item["hierarchy"],
        rank: item["rank"],
        acceptedId: item["acceptedId"],
        // Only the latest hierarchy change per taxon is sent; older rows drop it.
        // NOOP rows always send null.
        updateHier: getLatestUpdateHier(item, rowIndex, owners),
        // Each ancestor's position change is sent once, from the latest row that has it.
        positionHier: (() => {
          const owned = getOwnedPositionChanges(item, rowIndex, positionOwners);
          return owned.length > 0 ? owned.map((c) => c.raw) : null;
        })(),
        synonyms: (item["synonyms"] || []).filter((syn: string) => {
          const action = getSubRowComputedAction(syn, true, item["taxonId"]);
          return action === "CREATE" || action === "UPDATE";
        }),
        commonNames: (item["commonNames"] || []).filter(
          (cn: string) => cn.split("|")[1] === "CREATE"
        ),
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
        setSelectAll(false);
        setExcludedIds(new Set());
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
              <HStack justify="space-between" wrap="wrap" gap={2} mb={3}>
                <HStack gap={1.5} fontSize="sm" color="gray.600">
                  <Icon as={LuFilePlus} boxSize={4} />
                  <Text>
                    {speciesSelectedCount} of {speciesEligible.length} species pages selected
                  </Text>
                </HStack>
                <Button
                  variant="outline"
                  size="xs"
                  colorPalette="blue"
                  disabled={speciesEligible.length === 0}
                  onClick={() => {
                    setSelectAll((prev) => !prev);
                    setExcludedIds(new Set());
                  }}
                >
                  <LuCopyCheck />
                  {selectAll ? "Undo select all" : "Create pages for all"}
                </Button>
              </HStack>
              <VStack align="stretch" gap={3}>
                {uploadResult &&
                  uploadResult.map((item, index) => {
                    const hierarchyNodes = parseHierarchy(item["hierarchy"]);
                    // Position changes on taxa in the hierarchy, all shown on one
                    // "Position changes" line below the breadcrumb.
                    const positionChanges = getRowPositionChanges(item);
                    // Changes are shown inside the tags only while the row is set to
                    // Update; switching it to "No change" shows the current values.
                    const changes =
                      item["action"] === "UPDATE" ? getMainRowChanges(item) : [];
                    const nameChange = findChange(changes, "Name");
                    const statusChange = findChange(changes, "Status");
                    const positionChange = findChange(changes, "Position");
                    const acceptedIdChange = findChange(changes, "AcceptedId");
                    let acceptedId =
                      item["acceptedId"] && item["acceptedId"].includes("#")
                        ? item["acceptedId"].split("#")[1]
                        : item["acceptedId"];
                    const status = item["status"].includes("#")
                      ? item["status"].split("#")[1]
                      : item["status"];
                    if (item["status"].split("#").length > 2) {
                      acceptedId = item["status"].split("#")[2];
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
                            <Text fontWeight="medium">
                              {nameChange ? (
                                <>
                                  <Text
                                    as="span"
                                    textDecoration="line-through"
                                    color="gray.400"
                                    fontWeight="normal"
                                  >
                                    {nameChange.oldValue}
                                  </Text>
                                  <Icon
                                    as={LuArrowRight}
                                    boxSize={3}
                                    mx={1}
                                    color="gray.500"
                                    verticalAlign="middle"
                                  />
                                  {nameChange.newValue}
                                </>
                              ) : (
                                item["scientificName"].split("#")[0]
                              )}{" "}
                              <ValueBadge
                                value={item["status"].split("#")[0]}
                                change={statusChange}
                              />
                              <ValueBadge
                                value={item["position"].split("#")[0]}
                                change={positionChange}
                              />
                              {acceptedIdChange && (
                                <ValueBadge label="Accepted ID" change={acceptedIdChange} />
                              )}
                            </Text>
                          </Box>
                          <HStack gap={1.5} flexShrink={0}>
                            <ActionDropdown
                              action={item["action"]}
                              baseAction={item["originalAction"] ?? item["action"]}
                              error={item["error"]}
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
                            {hierarchyNodes.map((node, i, arr) => (
                              <Fragment key={i}>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <Text as="span" cursor="default">
                                      {node.name}
                                    </Text>
                                  </Tooltip.Trigger>
                                  <Tooltip.Positioner>
                                    <Tooltip.Content>
                                      {node.rank}: {node.name} #{node.id}
                                    </Tooltip.Content>
                                  </Tooltip.Positioner>
                                </Tooltip.Root>
                                {i < arr.length - 1 && (
                                  <Icon as={LuChevronRight} boxSize={3} mx={1} />
                                )}
                              </Fragment>
                            ))}
                          </HStack>
                        )}

                        {positionChanges.length > 0 && (
                          <HStack gap={1} wrap="wrap" fontSize="sm" color="gray.500" mt={1}>
                            <Text as="span">Position changes:</Text>
                            {positionChanges.map((c) => (
                              <HStack key={c.id} gap={1}>
                                <Text as="span">{c.name}</Text>
                                <ValueBadge
                                  change={{
                                    field: "Position",
                                    oldValue: c.oldValue,
                                    newValue: c.newValue
                                  }}
                                />
                              </HStack>
                            ))}
                          </HStack>
                        )}

                        <Box mt={2}>
                          <SpeciesPageToggle
                            item={item}
                            checked={isSpeciesSelected(item)}
                            onToggle={() => toggleSpecies(index, item["id"])}
                          />
                        </Box>

                        {item["synonyms"] && item["synonyms"].length > 0 && (
                          <SubRowGroup
                            label="Synonyms"
                            icon={LuRepeat}
                            items={item["synonyms"]}
                            synonym={true}
                            acceptedId={status == "ACCEPTED" ? item["taxonId"] : acceptedId}
                            parentError={item["action"] === "ERROR"}
                          />
                        )}
                        {item["commonNames"] && item["commonNames"].length > 0 && (
                          <SubRowGroup
                            label="Common names"
                            icon={LuTag}
                            items={item["commonNames"]}
                            synonym={false}
                            acceptedId={item["taxonId"]}
                            parentError={item["action"] === "ERROR"}
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
                hierarchyUpdates={hierarchyUpdates}
                positionUpdates={positionUpdates}
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