import { Box, Button, Flex, List, Table, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuMoveHorizontal } from "react-icons/lu";
import * as Yup from "yup";

import { useLocalRouter } from "@/components/@core/local-link";
import { SelectAsyncInputField } from "@/components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@/components/pages/observation/create/form/recodata/scientific-name";
import { axBulkTransferCommonNames } from "@/services/taxonomy.service";
import notification, { NotificationType } from "@/utils/notification";

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
  const router = useLocalRouter();
  const [commonNamesList, setCommonNamesList] = useState(commonNames || []);
  const [selectedCommonNames, setSelectedCommonNames] = useState<number[]>([]);
  const [transfer, setTransfer] = useState<boolean>(false);
  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        newTaxonId: Yup.number()
      })
    )
  });

  const onTransferSubmit = async (details) => {
    try {
      // Add your transfer logic here
      const { success, data } = await axBulkTransferCommonNames(
        {
          commonNameIds: selectedCommonNames.join(","),
          prevTaxonId: taxonId
        },
        {},
        details.newTaxonId
      );

      if (success) {
        notification("Common Names transfered successfully", NotificationType.Success);
        router.push(`/taxonomy/list`, true, { taxonId: data.id }, true);
      } else {
        notification("Error transfering common names");
      }
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

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
      {isContributor && (
        <Flex align="center" gap={2} mb={4}>
          <CommonNameAdd />
          {transfer == false && (
            <Button
              variant={"outline"}
              size="xs"
              colorPalette="blue"
              onClick={() => setTransfer(true)}
            >
              <LuMoveHorizontal />
              Transfer
            </Button>
          )}
          {selectedCommonNames.length > 0 && (
            <>
              <Box w="1px" h="20px" bg="gray.300" />
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                {selectedCommonNames.length} selected
              </Text>
              <FormProvider {...hForm}>
                <form
                  style={{ display: "flex", alignItems: "center" }}
                  onSubmit={hForm.handleSubmit(onTransferSubmit)}
                >
                  <Flex align="center" gap={2}>
                    <Box w="1px" h="20px" bg="gray.300" />
                    Transfer to
                    <Box>
                      <SelectAsyncInputField
                        name="newTaxonId"
                        multiple={false}
                        onQuery={(q) => onScientificNameQuery(q)}
                        optionComponent={ScientificNameOption}
                        placeholder={"Search accepted name"}
                        isRaw={true}
                        portalled={false}
                        mb={0}
                      />
                    </Box>
                    <Button
                      type="submit"
                      size="sm"
                      colorPalette="blue"
                      disabled={!hForm.formState.isValid}
                    >
                      Transfer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCommonNames([]);
                        setTransfer(false);
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </Flex>
                </form>
              </FormProvider>
            </>
          )}
        </Flex>
      )}

      <Table.Root size="sm" striped w="full">
        <Table.Body>
          {languagesList.length ? (
            languagesList.map((language) => (
              <Table.Row key={language} boxSize={"1/12"}>
                <Table.Cell w={{ md: "10rem" }}>{language}</Table.Cell>
                <Table.Cell>
                  <List.Root gap={2} unstyled>
                    {languagesData[language].map((commonName) => (
                      <List.Item key={commonName.name}>
                        {isContributor ? (
                          <CommonNameEditButtons
                            commonName={commonName}
                            showPreferred={speciesId}
                            selectecCommonNames={selectedCommonNames}
                            setSelectedCommonNames={setSelectedCommonNames}
                            transfer={transfer}
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
        </Table.Body>
      </Table.Root>
    </>
  );
}
