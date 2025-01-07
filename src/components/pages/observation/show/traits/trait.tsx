import "react-datepicker/dist/react-datepicker.css";

import { CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import { ColorEditSwatch } from "@components/pages/species/show/fields/traits/color/color-edit-swatch";
import EditIcon from "@icons/edit";
import { TraitsValue } from "@interfaces/traits";
import { axUpdateTraitById } from "@services/observation.service";
import { TRAIT_TYPES } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { getTraitIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import { cleanSingleFact } from "@utils/tags";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";

import TraitInput from "../../common/trait-input";
import MultipleCategorialTrait from "../../common/trait-input/multiple-categorical";

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
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null); // ref for the input element

  useEffect(() => {
    switch (traitType) {
      case TRAIT_TYPES.SINGLE_CATEGORICAL:
        setSelectedTraits(speciesTrait.values.filter((tr) => Number(finalTraitValue) === tr.id));
        break;

      case TRAIT_TYPES.MULTIPLE_CATEGORICAL:
        if (speciesTrait.traits.dataType != "COLOR") {
          setSelectedTraits(speciesTrait.values.filter((tr) => finalTraitValue.includes(tr.id)));
        } else {
          setSelectedTraits(finalTraitValue.map((v) => ({ value: v })));
        }
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
    <FormControl mb={4} key={speciesTrait.traits?.id}>
      <Flex mb={1} alignItems="center">
        <LocalLink href={`/traits/show/${speciesTrait.traits?.id}`} prefixGroup={true}>
          <BlueLink mr={2}>
            {speciesTrait.traits?.name}{" "}
            {speciesTrait.traits?.units && `(${speciesTrait.traits.units})`}
          </BlueLink>
        </LocalLink>
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
        speciesTrait.traits?.dataType === "STRING" && speciesTrait.traits?.traitTypes != "RANGE" ? (
          <TraitInput
            type={speciesTrait.traits?.traitTypes}
            values={speciesTrait.values}
            defaultValue={finalTraitValue}
            gridColumns={3}
            onUpdate={setTraitInputValue}
          />
        ) : speciesTrait.traits?.dataType === "STRING" &&
          speciesTrait.traits?.traitTypes == "RANGE" ? (
          <MultipleCategorialTrait
            name={speciesTrait.traits?.name}
            type={speciesTrait.traits?.traitTypes}
            values={speciesTrait.values}
            defaultValue={finalTraitValue}
            onUpdate={setTraitInputValue}
            gridColumns={3}
          />
        ) : speciesTrait.traits?.dataType === "NUMERIC" ? (
          <TraitInput
            type={speciesTrait.traits?.traitTypes}
            values={speciesTrait.values}
            defaultValue={finalTraitValue}
            gridColumns={3}
            onUpdate={setTraitInputValue}
          />
        ) : speciesTrait.traits?.dataType === "DATE" ? (
          <Box mb={3} maxW="md">
            <InputGroup>
              <DatePicker
                ref={inputRef} // Attach ref to DatePicker's input element
                customInput={<Input />}
                selected={
                  traitInputValue.length > 0 ? new Date(traitInputValue[0].split(":")[0]) : null
                }
                startDate={
                  traitInputValue.length > 0 ? new Date(traitInputValue[0].split(":")[0]) : null
                }
                endDate={
                  traitInputValue.length > 0 && traitInputValue[0].split(":").length > 1
                    ? new Date(traitInputValue[0].split(":")[1])
                    : null
                }
                dateFormat={"dd-MM-yyyy"}
                onChange={(v) => {
                  setTraitInputValue([
                    v
                      .filter((d) => d) // Filter out null or undefined values
                      .map((d) => d.toISOString().split("T")[0]) // Process remaining values
                      .join(":")
                  ]);
                }}
                selectsRange
              />

              <InputRightElement>
                <label htmlFor={speciesTrait.traits.name} style={{ cursor: "pointer" }}>
                  <CalendarIcon color="gray.300" />
                </label>
              </InputRightElement>
            </InputGroup>
          </Box>
        ) : speciesTrait.traits?.dataType === "COLOR" ? (
          <SimpleGrid columns={{ md: 3 }} spacing={4} mb={3}>
            {traitInputValue.map((value, index) => (
              <ColorEditSwatch
                key={index}
                index={index}
                color={value}
                onDelete={(index) => {
                  setTraitInputValue(traitInputValue.filter((_, i) => i !== index));
                }}
                onChange={(i, v) => {
                  const updatedTraitValues = [...traitInputValue];
                  updatedTraitValues[i] = v;
                  setTraitInputValue(updatedTraitValues);
                }}
              />
            ))}
            <Button
              h="3.25rem"
              alignItems="center"
              justifyContent="center"
              onClick={() => {
                setTraitInputValue([...traitInputValue, "rgb(255,255,255)"]);
              }}
            >
              {"Add"}
            </Button>
          </SimpleGrid>
        ) : (
          <p>Unsupported Data type</p>
        )
      ) : speciesTrait.traits.dataType == "STRING" ? (
        <SimpleGrid columns={[1, 1, 2, 3]} spacing={4}>
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
      ) : speciesTrait.traits.dataType == "NUMERIC" ? (
        <SimpleGrid columns={{ md: 3 }} spacing={4}>
          {selectedTraits.length ? (
            selectedTraits.map((tr) => (
              <Flex
                key={tr.id}
                border="2px"
                borderColor="gray.300"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                lineHeight={1}
                h="3.25rem"
              >
                <div>{tr.value}</div>
              </Flex>
            ))
          ) : (
            <Text color="gray.600">{t("common:unknown")}</Text>
          )}
        </SimpleGrid>
      ) : speciesTrait.traits.dataType == "NUMERIC" ? (
        <SimpleGrid columns={{ md: 3 }} spacing={4}>
          {selectedTraits.length ? (
            selectedTraits.map((tr) => (
              <Flex
                key={tr.id}
                border="2px"
                borderColor="gray.300"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                lineHeight={1}
                h="3.25rem"
              >
                <div>{tr.value}</div>
              </Flex>
            ))
          ) : (
            <Text color="gray.600">{t("common:unknown")}</Text>
          )}
        </SimpleGrid>
      ) : speciesTrait.traits.dataType == "NUMERIC" ? (
        <SimpleGrid columns={{ md: 3 }} spacing={4}>
          {selectedTraits.length ? (
            selectedTraits.map((tr) => (
              <Flex
                key={tr.id}
                border="2px"
                borderColor="gray.300"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                lineHeight={1}
                h="3.25rem"
              >
                <div>{tr.value}</div>
              </Flex>
            ))
          ) : (
            <Text color="gray.600">{t("common:unknown")}</Text>
          )}
        </SimpleGrid>
      ) : speciesTrait.traits.dataType == "DATE" ? (
        <SimpleGrid columns={{ md: 3 }} spacing={4}>
          {selectedTraits.length ? (
            selectedTraits.map((tr) => (
              <Flex
                key={tr.id}
                border="2px"
                borderColor="gray.300"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                lineHeight={1}
                h="3.25rem"
              >
                <div>{tr.value}</div>
              </Flex>
            ))
          ) : (
            <Text color="gray.600">{t("common:unknown")}</Text>
          )}
        </SimpleGrid>
      ) : speciesTrait.traits.dataType == "COLOR" ? (
        <SimpleGrid columns={{ md: 3 }} spacing={4}>
          {selectedTraits.length ? (
            selectedTraits.map((tr) => (
              <Box
                key={tr.value}
                border="2px"
                borderColor="rgba(0,0,0,0.1)"
                borderRadius="md"
                lineHeight={1}
                h="3.25rem"
                bg={tr.value}
              />
            ))
          ) : (
            <Text color="gray.600">{t("common:unknown")}</Text>
          )}
        </SimpleGrid>
      ) : (
        <Box></Box>
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
            {t("common:save")}
          </Button>
          <Button size="sm" ml={2} colorScheme="gray" aria-label="Cancel" onClick={onClose}>
            {t("common:cancel")}
          </Button>
        </Box>
      </Collapse>
    </FormControl>
  );
}
