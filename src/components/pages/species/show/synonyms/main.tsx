import { Table, Tbody, Td, Tr } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import { SynonymAdd, SynonymEditButtons } from "./actions";
import SynonymEditModal from "./edit-modal";

export default function SpeciesSynonym({ synonyms, isContributor }) {
  const { t } = useTranslation();

  const [synonymsList, setSynonymsList] = useState(synonyms);

  return (
    <>
      <SynonymEditModal onUpdate={setSynonymsList} />
      <Table size="sm" variant="striped">
        <Tbody>
          {synonymsList.length ? (
            synonymsList.map((synonym) => (
              <Tr key={synonym.id}>
                <Td w={{ md: "10rem" }} verticalAlign="top">
                  {synonym.status.toLowerCase()}
                </Td>
                <Td>
                  {isContributor ? (
                    <SynonymEditButtons synonym={synonym} />
                  ) : (
                    synonym.normalizedForm
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
