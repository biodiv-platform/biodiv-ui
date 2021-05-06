import { CheckIcon } from "@chakra-ui/icons";
import { Box, IconButton, Image, Stack, useDisclosure } from "@chakra-ui/react";
import { selectStyles } from "@components/form/configs";
import useTranslation from "@hooks/use-translation";
import CrossIcon from "@icons/cross";
import EditIcon from "@icons/edit";
import { SpeciesGroup } from "@interfaces/observation";
import { axUpdateSpeciesGroup } from "@services/observation.service";
import { isBrowser } from "@static/constants";
import { SPECIES_GROUP_UPDATED } from "@static/events";
import { getLocalIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { emit } from "react-gbus";
import Select, { components } from "react-select";

interface ISpeciesGroupsProps {
  id;
  speciesGroups: SpeciesGroup[] | undefined;
  observationId;
}

const CustomOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <Stack isInline={true} alignItems="center">
      <Image boxSize="2rem" src={getLocalIcon(props.data.label)} />
      <Box>{children}</Box>
    </Stack>
  </components.Option>
);

export default function SpeciesGroupBox({ id, speciesGroups, observationId }: ISpeciesGroupsProps) {
  const options = speciesGroups?.map((g) => ({ label: g.name, value: g.id }));
  const [finalType, setFinalType] = useState(options?.find((o) => o.value === id));
  const [type, setType] = useState(finalType);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();

  const handleOnSave = async () => {
    const { success } = await axUpdateSpeciesGroup(observationId, type?.value);
    if (success) {
      emit(SPECIES_GROUP_UPDATED, type?.value);
      setFinalType(type);
      notification(t("OBSERVATION.GROUP_UPDATED"), NotificationType.Success);
      onClose();
    }
  };

  return (
    <>
      {isOpen ? (
        <Stack isInline={false} w="full">
          <Box w="full">
            <Select
              name="group"
              inputId="group"
              value={type}
              options={options}
              onChange={setType}
              components={{
                Option: CustomOption
              }}
              menuPortalTarget={isBrowser && document.body}
              styles={selectStyles}
            />
          </Box>
          <Box flexShrink={0}>
            <IconButton
              size="xs"
              colorScheme="blue"
              aria-label="Save"
              type="submit"
              onClick={handleOnSave}
              icon={<CheckIcon />}
            />
            <IconButton
              size="xs"
              ml={2}
              colorScheme="gray"
              aria-label="Cancel"
              onClick={onClose}
              icon={<CrossIcon />}
            />
          </Box>
        </Stack>
      ) : (
        <Stack isInline={true} alignItems="top">
          <Image title={finalType?.label} boxSize="2.5rem" src={getLocalIcon(finalType?.label)} />
          <IconButton
            size="lg"
            aria-label="edit"
            icon={<EditIcon />}
            variant="ghost"
            colorScheme="blue"
            minW="auto"
            onClick={onToggle}
          />
        </Stack>
      )}
    </>
  );
}
