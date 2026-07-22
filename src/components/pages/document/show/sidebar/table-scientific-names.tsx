import { Box, Button, Skeleton, Table } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import { stickyTh } from "@components/pages/observation/list/views/stats/common";
import useGlobalState from "@hooks/use-global-state";
import { axRerunGnfinder, axUpdateScientifcNameToIsDeleted } from "@services/document.service";
import { adminOrAuthor } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import SimpleActionButton from "@/components/@core/action-buttons/simple";

export default function ScientificNamesTable({
  data,
  title,
  loadMoreNames,
  authorId,
  refreshFunc,
  documentId
}) {
  const { t } = useTranslation();

  const [showActions, setShowActions] = useState<boolean>();
  const { isLoggedIn } = useGlobalState();

  useEffect(() => {
    setShowActions(adminOrAuthor(authorId));
  }, [isLoggedIn]);

  return !data.isLoading ? (
    <Box className="white-box">
      <BoxHeading>
        ⭐ {title}{" "}
        {showActions && (
          <SimpleActionButton
            icon={<LuRefreshCw />}
            title={t("document:rerun")}
            onClick={() => axRerunGnfinder(documentId)}
            colorPalette="blue"
          />
        )}
      </BoxHeading>
      {data?.list?.length > 0 && (
        <Box w="full" overflowY="auto" h={360}>
          <Table.Root striped colorPalette="gray" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader {...stickyTh}>
                  {t("document:show.scientific_names_table.name_header")}
                </Table.ColumnHeader>
                <Table.ColumnHeader {...stickyTh}>
                  {t("document:show.scientific_names_table.count_header")}
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.list.map(({ id, canonicalForm, frequency, taxonConceptId }) => (
                <Table.Row>
                  <Table.Cell>
                    {taxonConceptId != null ? (
                      <ExternalBlueLink asChild>
                        <LocalLink
                          href={`/taxonomy/list`}
                          params={{ showTaxon: taxonConceptId, taxonId: taxonConceptId }}
                          prefixGroup={true}
                        >
                          {canonicalForm}
                        </LocalLink>
                      </ExternalBlueLink>
                    ) : (
                      canonicalForm
                    )}
                  </Table.Cell>

                  {/* isNumeric={true} */}
                  <Table.Cell>
                    {frequency}
                    {showActions && (
                      <DeleteActionButton
                        observationId={id}
                        title={t("document:show.scientific_names_table.delete.title")}
                        description={t("document:show.scientific_names_table.delete.description")}
                        deleted={t("document:show.scientific_names_table.delete.deleted")}
                        deleteFunc={axUpdateScientifcNameToIsDeleted}
                        deleteGnfinderName={true}
                        refreshFunc={refreshFunc}
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
      {data?.list?.length > 0 ? (
        <Button
          w="full"
          onClick={loadMoreNames}
          loading={data.isLoading}
          borderTopRadius={0}
          variant={"subtle"}
        >
          {t("common:load_more")}
        </Button>
      ) : (
        <Box w="full" overflowY="auto" m={2}>
          No data
        </Box>
      )}
    </Box>
  ) : (
    <Skeleton h={450} borderRadius="md" />
  );
}
