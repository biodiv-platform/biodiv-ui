import { Table, Tbody, Td, Tr } from "@chakra-ui/react";
import ScientificName from "@components/@core/scientific-name";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";

import { SynonymAdd, SynonymEditButtons } from "./actions";
import SynonymEditModal from "./edit-modal";

interface SynonymListProps {
  synonyms;
  isContributor;
  speciesId?;
  taxonId?;
  updateFunc;
  deleteFunc;
}

export default function SynonymList({
  synonyms,
  isContributor,
  speciesId,
  taxonId,
  updateFunc,
  deleteFunc
}: SynonymListProps) {
  const { t } = useTranslation();

  const [synonymsList, setSynonymsList] = useState(synonyms || []);

  const synonymsListSorted = useMemo(
    () => synonymsList.sort((a, b) => a.name?.localeCompare(b.name)),
    [synonymsList]
  );

  return (
    <>
      <SynonymEditModal
        onUpdate={setSynonymsList}
        speciesId={speciesId}
        taxonId={taxonId}
        updateFunc={updateFunc}
        deleteFunc={deleteFunc}
      />
      <Table size="sm" variant="striped">
        <Tbody>
          {synonymsListSorted.length ? (
            synonymsListSorted.map((synonym) => (
              <Tr key={synonym.id}>
                <Td w={{ md: "10rem" }} verticalAlign="top">
                  {synonym.status.toLowerCase()}
                </Td>
                <Td>
                  {isContributor ? (
                    <SynonymEditButtons synonym={synonym} />
                  ) : (
                    <ScientificName value={synonym.italicisedForm} />
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>{t("common:no_data")}</Td>
            </Tr>
          )}
          {isContributor && <SynonymAdd />}
        </Tbody>
      </Table>
    </>
  );
}
