// eslint-disable-next-line simple-import-sort/imports
import {
    Avatar,
    Box,
    Button,
    HStack,
    Skeleton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
  } from "@chakra-ui/react";
  import BoxHeading from "@components/@core/layout/box-heading";
  import { stickyTh } from "@components/pages/observation/list/views/stats/common";
import useGlobalState from "@hooks/use-global-state";
  import { adminOrAuthor } from "@utils/auth";
  import useTranslation from "next-translate/useTranslation";
  import React, { useEffect, useState } from "react";
  import DeleteActionButton from "@components/@core/action-buttons/delete";
  import {axUpdateScientifcNameToIsDeleted} from "@services/document.service";

  export default function ScientificNamesTable({data, title, loadMoreNames , authorId,nameData}) {
    const { t } = useTranslation();

    const [showActions, setShowActions] = useState<boolean>();
    const { isLoggedIn, user } = useGlobalState();

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
                <Th {...stickyTh}>Name</Th>
                <Th {...stickyTh}>Frequency</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.list.map(({ id,canonicalForm,frequency}) => (
                <Tr >
                  <Td>
                        {canonicalForm}
                        {showActions && (
                              <DeleteActionButton
                                observationId={id}
                                title={"Delete name"}
                                description={"are you sure you want to delete this name?"}
                                deleted={"name removed succcesfully"}
                                deleteFunc={axUpdateScientifcNameToIsDeleted}
                                deleteGnfinderName={true}
                                refreshgnfinderNameFunc={loadMoreNames}
                               />
                          ) }
                  </Td>
                  <Td isNumeric={true}>
                    {frequency}
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
