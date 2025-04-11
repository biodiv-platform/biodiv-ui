import {
  Box,
  Button,
  Collapsible,
  Flex,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import { TraitsValue } from "@interfaces/traits";
import { axUpdateTraitById } from "@services/observation.service";
import { TRAIT_TYPES } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { getTraitIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import { cleanSingleFact } from "@utils/tags";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import { Field } from "@/components/ui/field";

import TraitInput from "../../common/trait-input";

interface ITraitProp {
  speciesTrait: any;
  defaultValue;
  observationId;
  authorId;
  traitType?;
}

export default function Trait({
  speciesTrait,
  defaultValue,
  observationId,
  authorId,
  traitType
}: ITraitProp) {
  const [finalTraitValue, setFinalTraitValue] = useState(defaultValue);
  const [traitInputValue, setTraitInputValue] = useState(defaultValue);
  const [selectedTraits, setSelectedTraits] = useState<TraitsValue[]>([]);
  const { open, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();

  useEffect(() => {
    switch (traitType) {
      case TRAIT_TYPES.SINGLE_CATEGORICAL:
        setSelectedTraits(speciesTrait.values.filter((tr) => Number(finalTraitValue) === tr.id));
        break;

      case TRAIT_TYPES.MULTIPLE_CATEGORICAL:
        setSelectedTraits(speciesTrait.values.filter((tr) => finalTraitValue.includes(tr.id)));
        break;

      default:
        setSelectedTraits(finalTraitValue.map((v) => ({ value: v })));
        break;
    }
  }, [finalTraitValue]);

  const handleTraitUpdate = async () => {
    const { success } = await axUpdateTraitById(
      observationId,
      speciesTrait.traits?.id,
      cleanSingleFact(traitInputValue)
    );
    if (success) {
      setFinalTraitValue(traitInputValue);
      notification(t("observation:traits_update_success"), NotificationType.Success);
      onClose();
    }
  };

  return (
    <Field mb={4} key={speciesTrait.traits?.id}>
      <Flex mb={1} alignItems="center">
        {speciesTrait.traits?.name}
        {(speciesTrait.traits?.isParticipatory || adminOrAuthor(authorId)) && (
          <IconButton aria-label="Edit" variant="plain" colorPalette="blue" onClick={onToggle}>
            <EditIcon />
          </IconButton>
        )}
      </Flex>

      {open ? (
        <TraitInput
          type={speciesTrait.traits?.traitTypes}
          values={speciesTrait.values}
          defaultValue={finalTraitValue}
          gridColumns={3}
          onUpdate={setTraitInputValue}
        />
      ) : (
        <SimpleGrid columns={[1, 1, 2, 3]} gap={4}>
          {selectedTraits.length ? (
            selectedTraits.map((tr) => (
              <Flex
                alignItems="center"
                p={2}
                key={tr.value}
                cursor="pointer"
                borderWidth="2px"
                borderRadius="md"
                bg="white"
              >
                {tr?.icon && (
                  <Image
                    boxSize="2rem"
                    mr={2}
                    loading="lazy"
                    objectFit="contain"
                    src={getTraitIcon(tr.icon)}
                    alt={tr.value}
                  />
                )}
                <Text>{tr.value}</Text>
              </Flex>
            ))
          ) : (
            <Text color="gray.600">{t("common:unknown")}</Text>
          )}
        </SimpleGrid>
      )}
      <Collapsible.Root open={open} unmountOnExit={true}>
        <Collapsible.Content>
          <Box mt={2}>
            <Button
              size="sm"
              colorPalette="blue"
              aria-label="Save"
              type="submit"
              onClick={handleTraitUpdate}
            >
              {t("common:save")}
            </Button>
            <Button size="sm" ml={2} colorPalette="gray" aria-label="Cancel" onClick={onClose}>
              {t("common:cancel")}
            </Button>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Field>
  );
}
