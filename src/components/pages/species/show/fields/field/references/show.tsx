import { Box, ListItem, OrderedList } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import useTranslation from "@hooks/use-translation";
import { axRemoveSpeciesField } from "@services/species.service";
import { SPECIES_FIELD_DELETED, SPECIES_FIELD_UPDATE } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import React, { useMemo } from "react";
import { emit } from "react-gbus";

import useSpecies from "../../../use-species";
import FieldEditActionButtons from "../simple/action-buttons";

export default function ReferencesShow({ value }) {
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
