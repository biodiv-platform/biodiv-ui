import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import EditIcon from "@icons/edit";
import { TraitsValue, TraitsValuePair } from "@interfaces/traits";
import { axUpdateTraitById } from "@services/observation.service";
import { adminOrAuthor } from "@utils/auth";
import { getTraitIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";

import TraitInput from "../../common/trait-input";

interface ITraitProp {
  speciesTrait: TraitsValuePair;
  defaultValue;
  observationId;
  authorId;
}

export default function Trait({ speciesTrait, defaultValue, observationId, authorId }: ITraitProp) {
  const [finalTraitValue, setFinalTraitValue] = useState(defaultValue);
  const [traitInputValue, setTraitInputValue] = useState(defaultValue);
  const [selectedTraits, setSelectedTraits] = useState<TraitsValue[]>([]);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedTraits(
      (speciesTrait as any).values.filter((tr) =>
        Array.isArray(finalTraitValue) ? finalTraitValue.includes(tr.id) : finalTraitValue === tr.id
      )
    );
  }, [finalTraitValue]);

  const handleTraitUpdate = async () => {
    const { success } = await axUpdateTraitById(
      observationId,
      speciesTrait.traits?.id,
      traitInputValue
    );
    if (success) {
      setFinalTraitValue(traitInputValue);
      notification(t("OBSERVATION.TRAITS_UPDATE_SUCCESS"), NotificationType.Success);
      onClose();
    }
  };

  return (
    <FormControl mb={4} key={speciesTrait.traits?.id}>
      <Flex mb={1} alignItems="center">
        {speciesTrait.traits?.name}
        {(speciesTrait.traits?.isParticipatory || adminOrAuthor(authorId)) && (
          <IconButton
            aria-label="Edit"
            icon={<EditIcon />}
            variant="link"
            colorScheme="blue"
            onClick={onToggle}
          />
        )}
      </Flex>

      {isOpen ? (
        <TraitInput
          type={speciesTrait.traits?.traitTypes}
          values={speciesTrait.values}
          defaultValue={finalTraitValue}
          gridColumns={3}
          onUpdate={setTraitInputValue}
        />
      ) : (
        <SimpleGrid columns={[1, 1, 2, 3]} spacing={4}>
          {selectedTraits.length ? (
            selectedTraits.map((tr) => (
              <Flex
                alignItems="center"
                p={2}
                key={tr.id}
                cursor="pointer"
                borderWidth="2px"
                borderRadius="md"
                bg="white"
              >
                <Image
                  boxSize="2rem"
                  mr={2}
                  loading="lazy"
                  objectFit="contain"
                  src={getTraitIcon(tr.icon)}
                  alt={tr.value}
                />
                <Text>{tr.value}</Text>
              </Flex>
            ))
          ) : (
            <Text color="gray.600">{t("OBSERVATION.UNKNOWN")}</Text>
          )}
        </SimpleGrid>
      )}
      <Collapse in={isOpen} unmountOnExit={true}>
        <Box mt={2}>
          <Button
            size="sm"
            colorScheme="blue"
            aria-label="Save"
            type="submit"
            onClick={handleTraitUpdate}
          >
            {t("SAVE")}
          </Button>
          <Button size="sm" ml={2} colorScheme="gray" aria-label="Cancel" onClick={onClose}>
            {t("CANCEL")}
          </Button>
        </Box>
      </Collapse>
    </FormControl>
  );
}
