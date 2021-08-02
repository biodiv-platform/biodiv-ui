import { List, ListItem, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";

import { CommonNameAdd, CommonNameEditButtons } from "./actions";
import { CommonNameEditModal } from "./edit-modal";

export default function SpeciesCommonNames({ commonNames, isContributor }) {
  const { t } = useTranslation();
  const [commonNamesList, setCommonNamesList] = useState(commonNames || []);

  // groups common names by language
  const [languagesList, languagesData] = useMemo(() => {
    const newList = commonNamesList.reduce((acc, curr) => {
      const currentLanguage = curr?.language?.name || "Other";
      if (!acc[currentLanguage]) acc[currentLanguage] = []; //If this type wasn't previously stored
      acc[currentLanguage].push(curr);
      return acc;
    }, {});
    return [Object.keys(newList).sort(), newList];
  }, [commonNamesList]);

  return (
    <>
      <CommonNameEditModal onUpdate={setCommonNamesList} />
      <Table size="sm" variant="striped" w="full">
        <Tbody>
          {languagesList.length ? (
            languagesList.map((language) => (
              <Tr key={language}>
                <Td w={{ md: "10rem" }} verticalAlign="top">
                  {language}
                </Td>
                <Td>
                  <List spacing={2}>
                    {languagesData[language].map((commonName) => (
                      <ListItem key={commonName.name}>
                        {isContributor ? (
                          <CommonNameEditButtons commonName={commonName} />
                        ) : (
                          <div>{commonName.name}</div>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>{t("common:no_data")}</Td>
            </Tr>
          )}
          {isContributor && <CommonNameAdd />}
        </Tbody>
      </Table>
    </>
  );
}
