import { Badge, Box, Button, IconButton, Image, Text } from "@chakra-ui/react";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { axCheckSpecies } from "@services/species.service";
import { TAXON_BADGE_COLORS } from "@static/constants";
import { getLocalIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { LuDelete, LuPencil } from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

// "create" ignores the match and exports the row as unmatched (TaxonConceptId = CREATE)
type MatchAction = "match" | "update" | "create";

const ACTION_OPTIONS: { value: MatchAction; label: string }[] = [
  { value: "match", label: "Match" },
  { value: "update", label: "Update" },
  { value: "create", label: "Create" }
];

// Rows rendered at a time; large files can have thousands of names
const PAGE_SIZE = 100;

const NameTable = ({
  finalResult,
  selectedColumn,
  uploadResult,
  onDeleteRow,
  onUpdateRow,
  synonym = false,
  cname = false,
  hierarchy = false,
  getAction = undefined,
  onActionChange = undefined,
  canUpdate = undefined,
  canCreate = undefined
}: {
  /** Rows to show (may be a filtered subset of the full list) */
  finalResult: any[];
  selectedColumn: number | null;
  uploadResult: any[];
  /** Removes this row from the full list */
  onDeleteRow: (row: any) => void;
  /** Replaces this row with `next` in the full list */
  onUpdateRow: (row: any, next: any) => void;
  synonym?: boolean;
  cname?: boolean;
  hierarchy?: boolean;
  getAction?: (row: any) => MatchAction;
  onActionChange?: (row: any, action: MatchAction) => void;
  canUpdate?: (row: any) => boolean;
  canCreate?: (row: any) => boolean;
}) => {
  const [rowToDelete, setRowToDelete] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { t } = useTranslation();

  // Action column only shows when the parent passes both handlers (Given Names tab)
  const showAction = Boolean(getAction && onActionChange);

  const getMatches = (item): any[] => uploadResult[item[4]]?.[1] ?? [];

  // Options available for a row; "match" is always available
  const getAvailableActions = (item) =>
    ACTION_OPTIONS.filter(({ value }) => {
      if (value === "update") return !canUpdate || canUpdate(item);
      if (value === "create") return Boolean(canCreate && canCreate(item));
      return true;
    });

  const isMarkedCreate = (item) => showAction && getAction!(item) === "create";

  const getRowBg = (item) => {
    if (cname) {
      return Object.entries(item[1]).length > 0 ? "green.50" : "red.50";
    }
    // Rows marked "create" are treated as unmatched
    if (isMarkedCreate(item)) return "red.50";
    const matchCount = getMatches(item).length;
    if (matchCount === 0) return "red.50";
    if (matchCount === 1) return "green.50";
    return "yellow.50"; // multiple matches / ambiguous
  };

  // Picks one of several matches. The backend sends speciesId with each match;
  // only call the species service if it is missing.
  const selectOption = async (item, option) => {
    let speciesId = option?.speciesId;
    if (speciesId === undefined) {
      const { success, data } = await axCheckSpecies(option["id"]);
      speciesId = success ? data : null;
    }
    onUpdateRow(item, [item[0], option, speciesId ?? null, false, item[4]]);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      onDeleteRow(rowToDelete);
    }
    setRowToDelete(null);
  };

  const visibleRows = finalResult ? finalResult.slice(0, visibleCount) : [];
  const remaining = (finalResult?.length ?? 0) - visibleRows.length;

  return (
    <>
      <table className="table table-bordered">
        <thead>
          <tr>
            {!hierarchy && <th>{t("taxon:name_matching.species_name")}</th>}
            {(synonym || cname || hierarchy) && <th>Source</th>}
            {cname && <th>Language</th>}
            {hierarchy && <th>Rank</th>}
            {hierarchy && <th>Name</th>}
            <th>{t("taxon:name_matching.name_matches")}</th>
            {showAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((item) => {
            const availableActions = showAction ? getAvailableActions(item) : [];
            const matches = getMatches(item);
            const keyParts = item[0].split("#");
            return (
              <tr
                key={`${item[0]}-${item[4]}`}
                style={{
                  backgroundColor: `var(--chakra-colors-${getRowBg(item).replace(".", "-")})`
                }}
              >
                {!hierarchy && (
                  <td>
                    <SimpleActionButton
                      onClick={() => setRowToDelete(item)}
                      icon={<LuDelete />}
                      title={"Delete Scientific Name"}
                      colorPalette="red"
                    />
                    {selectedColumn !== null && (synonym || cname)
                      ? keyParts[0]
                      : item[0]?.slice(0, -1).split("#")[selectedColumn ? selectedColumn : 0]}
                  </td>
                )}
                {(synonym || cname || hierarchy) && <td>{keyParts[1]}</td>}
                {cname && <td>{keyParts[2]}</td>}
                {hierarchy && <td>{keyParts[2]}</td>}
                {hierarchy && <td>{keyParts[0]}</td>}
                <td>
                  {!cname && item[3] == false && (
                    <>
                      <Text m={4}>
                        <Image
                          boxSize="2.2rem"
                          objectFit="contain"
                          src={getLocalIcon(item[1]?.group_name)}
                          alt={item[1]?.group_name}
                          loading="lazy"
                        />
                        {item[1]?.name}
                        <Badge ml={2}>{item[1]?.rank}</Badge>
                        <Badge ml={2} colorPalette={TAXON_BADGE_COLORS[item[1]?.status]}>
                          {item[1]?.status}
                        </Badge>
                        <Badge ml={2} colorPalette={TAXON_BADGE_COLORS[item[1]?.position]}>
                          {item[1]?.position}
                        </Badge>
                        {matches.length > 1 && (
                          <Text float="right" color="green.700" fontWeight="bold">
                            {`${matches.length}  ${t("taxon:name_matching.multiple_matches")}`}
                            <IconButton
                              ml={2}
                              color="teal"
                              cursor="pointer"
                              aria-label="Choose a different match"
                              onClick={() =>
                                onUpdateRow(item, [item[0], item[1], item[2], true, item[4]])
                              }
                            >
                              <LuPencil />
                            </IconButton>
                          </Text>
                        )}
                        {matches.length == 1 && (
                          <Text float="right" color="green.700" fontWeight="bold">
                            {t("taxon:name_matching.one_match")}
                          </Text>
                        )}
                        {matches.length == 0 && (
                          <Text float="right" color="red.700" fontWeight="bold">
                            {t("taxon:name_matching.no_match")}
                          </Text>
                        )}
                      </Text>
                      {item[1]?.hierarchy && (
                        <Box p={2} px={4} mb={4} className="white-box">
                          <Text maxWidth="100%">
                            {item[1]?.hierarchy.map((name) => name["taxon_name"]).join(" / ")}
                          </Text>
                        </Box>
                      )}
                    </>
                  )}
                  {isMarkedCreate(item) && item[3] == false && (
                    <Alert bg="red.100" mb={2}>
                      <Text>{"Match ignored — this name will be created as a new taxon."}</Text>
                    </Alert>
                  )}
                  {!cname && item[2] && item[3] == false && (
                    <Alert bg="blue.50">
                      <Text>{t("taxon:name_matching.species_page_exist")}</Text>
                    </Alert>
                  )}
                  {!cname && !item[2] && item[3] == false && matches.length != 0 && (
                    <Alert bg="red.500" color="white">
                      <Text>{t("taxon:name_matching.no_species_page")}</Text>
                    </Alert>
                  )}
                  {!cname && item[3] == true && (
                    <Box>
                      {matches.map((option) => (
                        <Box
                          key={option["id"]}
                          padding={4}
                          _hover={{
                            bg: "lightgrey"
                          }}
                          cursor="pointer"
                          onClick={() => selectOption(item, option)}
                        >
                          {option["name"]}
                          <Badge ml={2}>{option["rank"]}</Badge>
                          <Badge ml={2} colorPalette={TAXON_BADGE_COLORS[option["status"]]}>
                            {option["status"]}
                          </Badge>
                          <Badge ml={2} colorPalette={TAXON_BADGE_COLORS[option["position"]]}>
                            {option["position"]}
                          </Badge>
                          {option["id"] == item[1]?.id && (
                            <Badge ml={2} colorPalette="blue">
                              {"Selected"}
                            </Badge>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                  {cname && (
                    <Text
                      float="right"
                      color={Object.entries(item[1]).length > 0 ? "green.700" : "red.700"}
                      fontWeight="bold"
                    >
                      {Object.entries(item[1]).length > 0
                        ? "Match Found"
                        : t("taxon:name_matching.no_match")}
                    </Text>
                  )}
                </td>
                {showAction && (
                  <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    <NativeSelectRoot
                      size="sm"
                      minW="7rem"
                      bg="white"
                      disabled={availableActions.length <= 1}
                    >
                      <NativeSelectField
                        aria-label="Action"
                        value={getAction!(item)}
                        onChange={(e) =>
                          onActionChange!(item, e.currentTarget.value as MatchAction)
                        }
                      >
                        {availableActions.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {remaining > 0 && (
        <Box textAlign="center" my={4}>
          <Text fontSize="sm" color="gray.600" mb={2}>
            {`Showing ${visibleRows.length} of ${finalResult.length}`}
          </Text>
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            {`Show ${Math.min(PAGE_SIZE, remaining)} more`}
          </Button>
        </Box>
      )}

      {/* One dialog for the whole table instead of one per row */}
      <DialogRoot
        open={rowToDelete !== null}
        onOpenChange={(e) => !e.open && setRowToDelete(null)}
      >
        <DialogBackdrop>
          <DialogContent>
            <DialogHeader fontSize="lg" fontWeight="bold">
              🗑️ {t("taxon:name_matching.delete_title")}
            </DialogHeader>
            <DialogBody>{t("taxon:name_matching.delete_description")}</DialogBody>

            <DialogFooter>
              <Button onClick={() => setRowToDelete(null)}>
                {t("taxon:name_matching.cancel")}
              </Button>
              <Button colorPalette="red" onClick={confirmDelete} ml={3}>
                {t("taxon:name_matching.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogBackdrop>
      </DialogRoot>
    </>
  );
};

export default NameTable;
