import { List, Table } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect,useMemo, useState } from "react";

import { CommonNameAdd, CommonNameEditButtons } from "./actions";
import { CommonNameEditModal } from "./edit-modal";

interface CommonNamesListProps {
  commonNames;
  isContributor;
  speciesId?;
  taxonId?;
  updateFunc;
  deleteFunc;
}

export default function CommonNamesList({
  commonNames,
  isContributor,
  speciesId,
  taxonId,
  updateFunc,
  deleteFunc
}: CommonNamesListProps) {
  const { t } = useTranslation();
  const [commonNamesList, setCommonNamesList] = useState(commonNames || []);

  useEffect(() => {
    setCommonNamesList(commonNames || []);
  }, [commonNames]);

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
      <CommonNameEditModal
        onUpdate={setCommonNamesList}
        updateFunc={updateFunc}
        deleteFunc={deleteFunc}
        speciesId={speciesId}
        taxonId={taxonId}
      />
      <Table.Root size="sm" striped w="full">
        <Table.Body>
          {languagesList.length ? (
            languagesList.map((language) => (
              <Table.Row key={language}>
                <Table.Cell w={{ md: "10rem" }} verticalAlign="top">
                  {language}
                </Table.Cell>
                <Table.Cell>
                  <List.Root gap={2} unstyled>
                    {languagesData[language].map((commonName) => (
                      <List.Item key={commonName.name}>
                        {isContributor ? (
                          <CommonNameEditButtons
                            commonName={commonName}
                            showPreferred={speciesId}
                          />
                        ) : (
                          <div>{commonName.name}</div>
                        )}
                      </List.Item>
                    ))}
                  </List.Root>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>{t("common:no_data")}</Table.Cell>
            </Table.Row>
          )}
          {isContributor && <CommonNameAdd />}
        </Table.Body>
      </Table.Root>
    </>
  );
}
