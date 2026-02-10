import { Box, Button, Checkbox, Flex, Table, Text } from "@chakra-ui/react";
import ScientificName from "@components/@core/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { useLocalRouter } from "@/components/@core/local-link";
import { SelectAsyncInputField } from "@/components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@/components/pages/observation/create/form/recodata/scientific-name";
import { axBulkTransferSynonyms } from "@/services/taxonomy.service";
import notification, { NotificationType } from "@/utils/notification";

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
  const router = useLocalRouter();

  const [synonymsList, setSynonymsList] = useState(synonyms || []);
  const [selectedSynonyms, setSelectedSynonyms] = useState<number[]>([]);
  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        newTaxonId: Yup.number()
      })
    )
  });

  useEffect(() => {
    setSynonymsList(synonyms || []);
  }, [synonyms]);

  const synonymsListSorted = useMemo(
    () => synonymsList.sort((a, b) => a.name?.localeCompare(b.name)),
    [synonymsList]
  );

  const onTransferSubmit = async (details) => {
    try {
      // Add your transfer logic here
      const { success, data } = await axBulkTransferSynonyms(
        {
          synonymIds: selectedSynonyms.join(","),
          prevTaxonId: taxonId
        },
        {},
        details.newTaxonId
      );

      if (success) {
        notification("Synonyms transfered successfully", NotificationType.Success);
        router.push(`/taxonomy/list`, true, { taxonId: data.id }, true);
      } else {
        notification("Error transfering synonyms");
      }
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  return (
    <>
      <SynonymEditModal
        onUpdate={setSynonymsList}
        speciesId={speciesId}
        taxonId={taxonId}
        updateFunc={updateFunc}
        deleteFunc={deleteFunc}
      />
      {isContributor && (
        <Flex align="center" gap={2} mb={4}>
          <SynonymAdd />
          {selectedSynonyms.length > 0 && (
            <>
              <Box w="1px" h="20px" bg="gray.300" />
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                {selectedSynonyms.length} selected
              </Text>
              <FormProvider {...hForm}>
                <form
                  style={{ display: "flex", alignItems: "center" }}
                  onSubmit={hForm.handleSubmit(onTransferSubmit)}
                >
                  <Flex align="center" gap={2}>
                    <Box>
                      <SelectAsyncInputField
                        name="newTaxonId"
                        multiple={false}
                        onQuery={(q) => onScientificNameQuery(q)}
                        optionComponent={ScientificNameOption}
                        placeholder={t("form:min_three_chars")}
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
                        setSelectedSynonyms([]);
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

      <Table.Root size="sm" striped>
        <Table.Body>
          {synonymsListSorted.length ? (
            synonymsListSorted.map((synonym) => (
              <Table.Row key={synonym.id}>
                <Table.Cell>
                  {isContributor && (
                    <Checkbox.Root
                      checked={selectedSynonyms.includes(synonym.id)}
                      onCheckedChange={(details) => {
                        setSelectedSynonyms((prev) =>
                          details.checked
                            ? [...prev, synonym.id]
                            : prev.filter((id) => id !== synonym.id)
                        );
                      }}
                      colorPalette={"blue"}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  )}
                </Table.Cell>
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
