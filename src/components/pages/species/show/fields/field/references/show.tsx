import { Box, ListItem, OrderedList } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import { axRemoveSpeciesField } from "@services/species.service";
import { SPECIES_FIELD_DELETED, SPECIES_FIELD_UPDATE } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { emit } from "react-gbus";

import useSpecies from "../../../use-species";
import FieldEditActionButtons from "../simple/action-buttons";

export default function ReferencesShow({ value }) {
  if (value.references.length === 0) {
    return null;
  }

  const { t } = useTranslation();
  const { getFieldPermission } = useSpecies();

  const hasFieldPermission = useMemo(() => getFieldPermission(value), [value]);

  const handleOnDelete = async () => {
    const { success } = await axRemoveSpeciesField(value.id);
    if (success) {
      emit(SPECIES_FIELD_DELETED, value);
      notification(t("species:field.delete.success"), NotificationType.Success);
    } else {
      notification(t("species:field.delete.failure"));
    }
  };

  const handleOnEdit = () =>
    emit(SPECIES_FIELD_UPDATE, { ...value, isEdit: true, referencesOnly: true });

  return (
    <Box>
      {hasFieldPermission && (
        <FieldEditActionButtons onEdit={handleOnEdit} onDelete={handleOnDelete} p={0} pb={1} />
      )}
      <OrderedList>
        {value.references.map(({ title, url }, index) => (
          <ListItem key={index}>
            {title} {url && <ExternalBlueLink href={url} />}
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}
