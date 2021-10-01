import { Box, Button, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import { stickyTh } from "@components/pages/observation/list/views/stats/common";
import useGlobalState from "@hooks/use-global-state";
import { axUpdateScientifcNameToIsDeleted } from "@services/document.service";
import { adminOrAuthor } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

export default function ScientificNamesTable({
  data,
  title,
  loadMoreNames,
  authorId,
  refreshFunc
}) {
  const { t } = useTranslation();

  const [showActions, setShowActions] = useState<boolean>();
  const { isLoggedIn } = useGlobalState();

  useEffect(() => {
    setShowActions(adminOrAuthor(authorId));
  }, [isLoggedIn]);

  return data?.list?.length > 0 ? (
    <Box className="white-box">
      <BoxHeading>⭐ {title}</BoxHeading>
      <Box w="full" overflowY="auto" h={360}>
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th {...stickyTh}>{t("document:show.scientific_names_table.name_header")}</Th>
              <Th {...stickyTh}>{t("document:show.scientific_names_table.count_header")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.list.map(({ id, canonicalForm, frequency, taxonConceptId }) => (
              <Tr>
                <Td>
                  {taxonConceptId != null ? (
                    <LocalLink
                      href={`/taxonomy/list?showTaxon=${taxonConceptId}&taxonId=${taxonConceptId}`}
                      prefixGroup={true}
                    >
                      <ExternalBlueLink>{canonicalForm}</ExternalBlueLink>
                    </LocalLink>
                  ) : (
                    canonicalForm
                  )}
                </Td>

                <Td isNumeric={true}>
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
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Button w="full" onClick={loadMoreNames} isLoading={data.isLoading} borderTopRadius={0}>
        {t("common:load_more")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : null;
}
