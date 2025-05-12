import { Box, Button, Heading, Input, InputGroup, SimpleGrid } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import TraitInput from "@components/pages/observation/common/trait-input";
import MultipleCategorialTrait from "@components/pages/observation/common/trait-input/multiple-categorical";
import SITE_CONFIG from "@configs/site-config";
import { axUpdateSpeciesTrait } from "@services/traits.service";
import { SPECIES_FIELD_UPDATE } from "@static/events";
import { getParsedUser } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import { emit } from "react-gbus";
import { LuCalendar, LuCheck, LuPlus, LuX } from "react-icons/lu";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import useSpecies from "../../../use-species";
import { ColorEditSwatch } from "../../traits/color/color-edit-swatch";

interface SpeciesFieldSimpleCreateProps {
  fieldId;
  traits;
  referencesOnly?;
}

export default function SpeciesFieldSimpleCreate({
  fieldId,
  traits,
  referencesOnly
}: SpeciesFieldSimpleCreateProps) {
  const router = useLocalRouter();
  const {
    species: {
      species: { id: speciesId, taxonConceptId }
    }
  } = useSpecies();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [traitValues, setTraitValues] = useState<any[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const hasNewTraits =
    traits == undefined || traits.filter((item) => item.values.length === 0).length == 0;

  const handleOnChange = (traitId, value) => {
    setTraitValues({
      ...traitValues,
      [traitId]: Array.isArray(value) ? value : value ? [value] : []
    });
  };

  const handleOnChangeDate = (traitId, value) => {
    setTraitValues({
      ...traitValues,
      [traitId]: value.map((d) => d.toISOString().split("t")[0])
    });
  };

  const addUndefinedValue = (traitId) => {
    setTraitValues((prevTraitValues) => {
      // Check if traitId exists; if not, initialize it with an empty array
      const existingValues = prevTraitValues[traitId] || [];

      return {
        ...prevTraitValues,
        [traitId]: [...existingValues, "rgb(255,255,255)"]
      };
    });
  };

  const onSwatchDelete = (traitId, index) => {
    setTraitValues((prevTraitValues) => {
      const newValues = prevTraitValues[traitId].filter((_, i) => i !== index);

      return {
        ...prevTraitValues,
        [traitId]: newValues
      };
    });
  };

  const onSwatchChange = (traitId, index, updatedValue) => {
    setTraitValues((prevTraitValues) => {
      const existingValues = prevTraitValues[traitId];
      existingValues[index] = updatedValue;

      return {
        ...prevTraitValues,
        [traitId]: existingValues
      };
    });
  };

  const handleOnCreate = () =>
    emit(SPECIES_FIELD_UPDATE, {
      fieldId,
      isEdit: false,
      fieldData: {
        status: "UNDER_CREATION"
      },
      contributor: [],
      references: [],
      license: { id: SITE_CONFIG.LICENSE.DEFAULT },
      referencesOnly
    });

  return (
    <div>
      <Button variant="outline" size="xs" colorPalette="green" onClick={handleOnCreate}>
        <LuPlus />
        {t("common:add")}
      </Button>
      {!hasNewTraits && (
        <Button ml={4} variant="outline" size="xs" colorPalette="green" onClick={openModal}>
          <LuPlus />
          {t("common:add_trait")}
        </Button>
      )}
      <DialogRoot onOpenChange={closeModal} trapFocus={false} size="xl" open={isModalOpen}>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>{"Add New Trait"}</DialogHeader>
          <DialogCloseTrigger onClick={() => setTraitValues([])} />
          <DialogBody>
            {!hasNewTraits &&
              traits
                .filter((item) => item.values.length === 0)
                .map((t) => (
                  <Box mb={4}>
                    <Heading as="h4" size="sm" mb={2} alignItems="center" display="flex">
                      {t.name}
                    </Heading>
                    {t.dataType == "STRING" && t.traitTypes != "RANGE" && (
                      <TraitInput
                        name={t.name}
                        type={t.traitTypes}
                        values={t.options}
                        defaultValue={traits.traitId ? traitValues[traits.traitId] : undefined}
                        onUpdate={(v) => handleOnChange(t.traitId, v)}
                        gridColumns={3}
                      />
                    )}
                    {t.dataType == "NUMERIC" && (
                      <TraitInput
                        name={t.name}
                        type={t.traitTypes}
                        values={t.options}
                        defaultValue={traits.traitId ? traitValues[traits.traitId] : undefined}
                        onUpdate={(v) => handleOnChange(t.traitId, v)}
                        gridColumns={3}
                      />
                    )}
                    {t.dataType == "COLOR" && (
                      <SimpleGrid columns={{ md: 3 }} gap={4} mb={3}>
                        {traitValues[t.traitId] &&
                          traitValues[t.traitId].map((value, index) => (
                            <ColorEditSwatch
                              key={index}
                              index={index}
                              color={value}
                              onDelete={(i) => onSwatchDelete(t.traitId, i)}
                              onChange={(i, v) => onSwatchChange(t.traitId, i, v)}
                            />
                          ))}
                        <Button
                          h="3.25rem"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => addUndefinedValue(t.traitId)}
                        >
                          {"Add"}
                        </Button>
                      </SimpleGrid>
                    )}
                    {t.dataType == "DATE" && (
                      <Box mb={3} maxW="md">
                        <InputGroup
                          endElement={
                            <label htmlFor={t.traitId} style={{ cursor: "pointer" }}>
                              <LuCalendar color="gray.300" />
                            </label>
                          }
                        >
                          <Flatpickr
                            value={traitValues[t.traitId] || []}
                            options={{ allowInput: true, dateFormat: "d-m-Y", mode: "range" }}
                            onChange={(v) => handleOnChangeDate(t.traitId, v)}
                            render={({ defaultValue, value, ...props }, ref) => (
                              <Input
                                id={t.traitId}
                                {...props}
                                defaultValue={defaultValue}
                                ref={ref}
                              />
                            )}
                          />
                        </InputGroup>
                      </Box>
                    )}
                    {t.dataType == "STRING" && t.traitTypes == "RANGE" && (
                      <MultipleCategorialTrait
                        name={t.name}
                        type={t.traitTypes}
                        values={t.options}
                        defaultValue={traits.traitId ? traitValues[traits.traitId] : undefined}
                        onUpdate={(v) => handleOnChange(t.traitId, v)}
                        gridColumns={3}
                      />
                    )}
                  </Box>
                ))}
            <DialogFooter>
              <Button
                onClick={async () => {
                  const { success } = await axUpdateSpeciesTrait(
                    speciesId,
                    traitValues,
                    getParsedUser().id,
                    taxonConceptId
                  );
                  if (success) {
                    notification("Traits Added", NotificationType.Success);
                    setIsModalOpen(false);
                    router.reload();
                  } else {
                    notification("Unable to add traits");
                  }
                }}
              >
                <LuCheck />
                {t("common:save")}
              </Button>
              <Button
                ml={4}
                onClick={() => {
                  setTraitValues([]);
                  setIsModalOpen(false);
                }}
              >
                <LuX />
                {t("common:cancel")}
              </Button>
            </DialogFooter>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
