import { ChevronDownIcon, ChevronRightIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Alert,
  Box,
  Flex,
  IconButton,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import ExternalBlueLink from "@components/@core/blue-link/external";
import LocalLink from "@components/@core/local-link";
import Badge from "@components/@core/user/badge";
import useGlobalState from "@hooks/use-global-state";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { axRemoveSpeciesField } from "@services/species.service";
import { SPECIES_FIELD_DELETED, SPECIES_FIELD_UPDATE } from "@static/events";
import { getLanguageNameById } from "@utils/i18n";
import notification, { NotificationType } from "@utils/notification";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";
import { emit } from "react-gbus";

import useSpecies from "../../../use-species";
import FieldEditActionButtons from "./action-buttons";
import SpeciesFieldResource from "./resource";

const BlockList = ({ title, children }) => (
  <Tr>
    <Td verticalAlign="baseline" fontWeight="bold">
      {title}&emsp;
    </Td>
    <Td>{children}</Td>
  </Tr>
);

export default function SpeciesFieldSimple({ value }) {
  const { isOpen, onToggle } = useDisclosure();
  const { t } = useTranslation();
  const { getFieldPermission } = useSpecies();
  const { languageId } = useGlobalState();
  const [langShow, setLangShow] = useState(false);

  const hasFieldPermission = useMemo(() => getFieldPermission(value), [value]);
  const [fieldLanguageName, isDefaultLang] = useMemo(
    () => [
      getLanguageNameById(value?.fieldData?.languageId),
      languageId === value?.fieldData?.languageId
    ],
    [languageId, value?.fieldData?.languageId]
  );

  const handleOnDelete = async () => {
    const { success } = await axRemoveSpeciesField(value.id);
    if (success) {
      emit(SPECIES_FIELD_DELETED, value);
      notification(t("species:field.delete.success"), NotificationType.Success);
    } else {
      notification(t("species:field.delete.failure"));
    }
  };

  const handleOnEdit = () => emit(SPECIES_FIELD_UPDATE, { ...value, isEdit: true });

  return (
    <>
      {!isDefaultLang && (
        <Alert
          status="info"
          borderRadius="md"
          onClick={() => setLangShow(!langShow)}
          cursor="pointer"
        >
          {langShow ? <ChevronDownIcon /> : <ChevronRightIcon />}{" "}
          {t("species:content_another_language")} ({fieldLanguageName})
        </Alert>
      )}
      {(langShow || isDefaultLang) && (
        <Box border="1px" borderColor="gray.300" overflow="hidden" borderRadius="md">
          <SpeciesFieldResource resources={value?.speciesFieldResource} />
          {hasFieldPermission && (
            <FieldEditActionButtons onEdit={handleOnEdit} onDelete={handleOnDelete} />
          )}
          <Prose>
            <Box
              overflow="auto"
              p={2}
              className="preview"
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(value?.fieldData?.description || "Empty")
              }}
            />
          </Prose>
          <Box bg="gray.50" fontSize="sm" borderTop="1px" borderColor="gray.300" p={2}>
            <Flex justifyContent="space-between">
              <Box>{value?.attributions || value?.contributor.map((u) => u.name).join(", ")}</Box>
              <div>
                <IconButton
                  minW="auto"
                  size="sm"
                  m={1}
                  variant="link"
                  aria-label="toggle"
                  icon={<InfoOutlineIcon />}
                  onClick={onToggle}
                />
              </div>
            </Flex>
            <div data-hidden={!isOpen}>
              <Table size="xs" variant="unstyled" mt={3}>
                <Tbody>
                  <BlockList title={t("species:attributions")}>{value?.attributions}</BlockList>
                  <BlockList title={t("species:contributors")}>
                    {value?.contributor.map((user) => (
                      <div key={user.id}>
                        <LocalLink href={`/user/show/${user.id}`} prefixGroup={true}>
                          <BlueLink>
                            {user.name} <Badge isAdmin={user.isAdmin} />
                          </BlueLink>
                        </LocalLink>
                      </div>
                    ))}
                  </BlockList>
                  <BlockList title={t("species:status")}>{value?.fieldData?.status}</BlockList>
                  <BlockList title={t("species:licenses")}>
                    <ExternalBlueLink href={value?.license?.url}>
                      {value?.license?.name}
                    </ExternalBlueLink>
                  </BlockList>
                  <BlockList title={t("species:references")}>
                    <OrderedList>
                      {value?.references.map(({ title, url }, index) => (
                        <ListItem key={index}>
                          {title} {url && <ExternalBlueLink href={url} />}
                        </ListItem>
                      ))}
                    </OrderedList>
                  </BlockList>
                </Tbody>
              </Table>
            </div>
          </Box>
        </Box>
      )}
    </>
  );
}
