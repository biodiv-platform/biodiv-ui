import { Box, Button, Checkbox, Flex, Table, Text, useCheckboxGroup } from "@chakra-ui/react";
import ScientificName from "@components/@core/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuCopyCheck, LuMoveHorizontal } from "react-icons/lu";
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
  setLoading?;
}

export default function SynonymList({
  synonyms,
  isContributor,
  speciesId,
  taxonId,
  updateFunc,
  deleteFunc,
  setLoading
}: SynonymListProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();

  const [synonymsList, setSynonymsList] = useState(synonyms || []);
  const [selectAll, setSelectAll] = useState(false);
  const { getItemProps, value: bulkSynonymIds, setValue } = useCheckboxGroup();
  const [transfer, setTransfer] = useState<boolean>(false);
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
      setLoading(true);
      const { success, data } = await axBulkTransferSynonyms(
        {
          synonymIds: bulkSynonymIds.join(","),
          prevTaxonId: taxonId,
          selectAll: selectAll
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
    setLoading(false);
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
          {transfer == true && (
            <Button
              variant={"outline"}
              size="xs"
              colorPalette="blue"
              onClick={() => {
                setSelectAll(true);
                setValue(synonymsList?.map((i) => String(i.id)));
              }}
            >
              <LuCopyCheck />
              Select All
            </Button>
          )}
          {bulkSynonymIds.length > 0 && (
            <>
              <Box w="1px" h="20px" bg="gray.300" />
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                {bulkSynonymIds.length} selected
              </Text>
              <FormProvider {...hForm}>
                <form
                  style={{ display: "flex", alignItems: "center" }}
                  onSubmit={hForm.handleSubmit(onTransferSubmit)}
                >
                  <Flex align="center" gap={2}>
                    <Box w="1px" h="20px" bg="gray.300" />
                    Transfer to
                    <Box minW={310}>
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
                        setValue([]);
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

      <Table.Root size="sm" striped>
        <Table.Body>
          {synonymsListSorted.length ? (
            synonymsListSorted.map((synonym) => (
              <Table.Row key={synonym.id}>
                <Table.Cell>
                  {isContributor && transfer == true && (
                    <Checkbox.Root {...getItemProps({ value: synonym.id })} colorPalette={"blue"}>
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
