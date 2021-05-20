import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
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
import HTMLContainer from "@components/@core/html-container";
import LocalLink from "@components/@core/local-link";
import Badge from "@components/@core/user/badge";
import useTranslation from "@hooks/use-translation";
import { axRemoveSpeciesField } from "@services/species.service";
import { SPECIES_FIELD_DELETED, SPECIES_FIELD_UPDATE } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import { getInjectableHTML } from "@utils/text";
import React, { useMemo } from "react";
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

  const hasFieldPermission = useMemo(() => getFieldPermission(value), [value]);

  const handleOnDelete = async () => {
    const { success } = await axRemoveSpeciesField(value.id);
    if (success) {
      emit(SPECIES_FIELD_DELETED, value);
      notification(t("SPECIES.FIELD.DELETE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("SPECIES.FIELD.DELETE.FAILURE"));
    }
  };

  const handleOnEdit = () => emit(SPECIES_FIELD_UPDATE, { ...value, isEdit: true });

  return (
    <Box border="1px" borderColor="gray.300" overflow="hidden" borderRadius="md">
      <SpeciesFieldResource resources={value?.speciesFieldResource} />
      {hasFieldPermission && (
        <FieldEditActionButtons onEdit={handleOnEdit} onDelete={handleOnDelete} />
      )}
      <Box
        as={HTMLContainer}
        p={2}
        className="preview"
        dangerouslySetInnerHTML={{
          __html: getInjectableHTML(value?.fieldData?.description || "Empty")
        }}
      />
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
              <BlockList title={t("SPECIES.ATTRIBUTIONS")}>{value?.attributions}</BlockList>
              <BlockList title={t("SPECIES.CONTRIBUTORS")}>
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
              <BlockList title={t("SPECIES.STATUS")}>{value?.fieldData?.status}</BlockList>
              <BlockList title={t("SPECIES.LICENSES")}>
                <ExternalBlueLink href={value?.license?.url}>
                  {value?.license?.name}
                </ExternalBlueLink>
              </BlockList>
              <BlockList title={t("SPECIES.REFERENCES")}>
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
  );
}
