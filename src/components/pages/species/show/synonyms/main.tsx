import { Table } from "@chakra-ui/react";
import ScientificName from "@components/@core/scientific-name";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect,useMemo, useState } from "react";

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

  useEffect(() => {
    setSynonymsList(synonyms || []);
  }, [synonyms]);

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
      {isContributor && <SynonymAdd />}

      <Table.Root size="sm" striped>
        <Table.Body>
          {synonymsListSorted.length ? (
            synonymsListSorted.map((synonym) => (
              <Table.Row key={synonym.id}>
                <Table.Cell w={{ md: "10rem" }}>{synonym.status.toLowerCase()}</Table.Cell>
                <Table.Cell>
                  {isContributor ? (
                    <SynonymEditButtons synonym={synonym} />
                  ) : (
                    <ScientificName value={synonym.italicisedForm} />
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>{t("common:no_data")}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
}
