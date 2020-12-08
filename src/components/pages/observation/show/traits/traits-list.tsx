import { Box } from "@chakra-ui/react";
import { FactValuePair, TraitsValuePair } from "@interfaces/traits";
import { axGetTraitsByGroupId } from "@services/observation.service";
import { TRAIT_TYPES } from "@static/constants";
import { SPECIES_GROUP_UPDATED } from "@static/events";
import React, { useEffect, useState } from "react";
import { useListener } from "react-gbus";

import Trait from "./trait";

export interface ITraitsProps {
  factsList?: FactValuePair[];
  speciesTraitsListDefault: TraitsValuePair[] | undefined;
  observationId;
  authorId?;
}

export default function TraitsList({
  factsList,
  speciesTraitsListDefault,
  observationId,
  authorId = -1
}: ITraitsProps) {
  const [newTraitsList, setNewTraitsList] = useState<any[]>([]);
  const [speciesTraitsList, setSpeciesTraitsList] = useState(speciesTraitsListDefault);

  useListener(
    (groupId) => {
      axGetTraitsByGroupId(groupId).then(
        ({ success, data }) => success && setSpeciesTraitsList(data)
      );
    },
    [SPECIES_GROUP_UPDATED]
  );

  useEffect(() => {
    setNewTraitsList(
      speciesTraitsList
        ? speciesTraitsList.map((speciesTrait) => {
            switch (speciesTrait.traits?.traitTypes) {
              case TRAIT_TYPES.SINGLE_CATEGORICAL:
                return {
                  defaultValue: factsList?.find((v) => v.nameId === speciesTrait.traits?.id)
                    ?.valueId,
                  speciesTrait
                };

              case TRAIT_TYPES.MULTIPLE_CATEGORICAL:
                return {
                  defaultValue: factsList
                    ?.filter((v) => v.nameId === speciesTrait.traits?.id)
                    .map((v) => v.valueId),
                  speciesTrait
                };

              default:
                return { defaultValue: null, speciesTrait };
            }
          })
        : []
    );
  }, [factsList, speciesTraitsList]);

  return (
    <Box p={4} pb={0}>
      {newTraitsList.map(({ defaultValue, speciesTrait }) => (
        <Trait
          key={speciesTrait.traits.id}
          speciesTrait={speciesTrait}
          defaultValue={defaultValue}
          observationId={observationId}
          authorId={authorId}
        />
      ))}
    </Box>
  );
}
