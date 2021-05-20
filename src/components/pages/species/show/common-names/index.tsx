import { Box, List, ListItem, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { ResponsiveContainer } from "@components/@core/table";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "@hooks/use-translation";
import React, { useMemo, useState } from "react";

import useSpecies from "../use-species";
import { CommonNameAdd, CommonNameEditButtons } from "./actions";
import { CommonNameEditModal } from "./edit-modal";

export default function SpeciesCommonNames() {
  const { t } = useTranslation();
  const { species, permissions } = useSpecies();
  const [commonNamesList, setCommonNamesList] = useState(species.taxonomicNames.commonNames || []);

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
    <ToggleablePanel id="common-names" icon="🗒" title={t("SPECIES.COMMON_NAMES")}>
      <CommonNameEditModal onUpdate={setCommonNamesList} />
      <Box maxH="300px" w="full" overflow="auto">
        <ResponsiveContainer noBorder={true}>
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
                            {permissions.isContributor ? (
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
                  <Td>{t("NO_DATA")}</Td>
                </Tr>
              )}
              {permissions.isContributor && <CommonNameAdd />}
            </Tbody>
          </Table>
        </ResponsiveContainer>
      </Box>
    </ToggleablePanel>
  );
}
