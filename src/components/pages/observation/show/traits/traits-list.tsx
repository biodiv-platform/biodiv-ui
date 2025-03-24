import { Box } from "@chakra-ui/react";
import useGlobalState from "@hooks/use-global-state";
import { FactValuePair, TraitsValuePair } from "@interfaces/traits";
import { axGetTraitsByGroupId } from "@services/observation.service";
import { TRAIT_TYPES } from "@static/constants";
import { SPECIES_GROUP_UPDATED } from "@static/events";
import { formatDate } from "@utils/date";
import React, { useEffect, useState } from "react";
import { useListener } from "react-gbus";

import Trait from "./trait";

export interface ITraitsProps {
  factsList?: FactValuePair[];
  speciesTraitsListDefault: TraitsValuePair[] | undefined;
  observationId;
  authorId?;
  groupId?;
}

export default function TraitsList({
  factsList,
  speciesTraitsListDefault,
  observationId,
  authorId = -1,
  groupId
}: ITraitsProps) {
  const [newTraitsList, setNewTraitsList] = useState<any[]>([]);
  const [speciesTraitsList, setSpeciesTraitsList] = useState(speciesTraitsListDefault);
  const { languageId } = useGlobalState();

  useListener(
    (groupId) => {
      axGetTraitsByGroupId(groupId, languageId).then(
        ({ success, data }) => success && setSpeciesTraitsList(data)
      );
    },
    [SPECIES_GROUP_UPDATED]
  );

  useEffect(() => {
    axGetTraitsByGroupId(groupId, languageId).then(({ data }) => setSpeciesTraitsList(data));
  }, [languageId]);

  useEffect(() => {
    setNewTraitsList(
      speciesTraitsList
        ? speciesTraitsList.map((speciesTrait) => {
            const traitType = speciesTrait.traits?.traitTypes;

            switch (speciesTrait.traits?.traitTypes) {
              case TRAIT_TYPES.SINGLE_CATEGORICAL:
                return {
                  defaultValue: factsList?.find((v) => v.nameId === speciesTrait.traits?.traitId)
                    ?.valueId,
                  speciesTrait,
                  traitType
                };

              case TRAIT_TYPES.RANGE:
                if (speciesTrait.traits?.dataType == "DATE") {
                  return {
                    defaultValue: factsList
                      ?.filter((v) => v.nameId === speciesTrait.traits?.traitId)
                      .map((o) =>
                        o.toDate
                          ? formatDate(o.fromDate, "YYYY-MM-DD") +
                            ":" +
                            formatDate(o.toDate, "YYYY-MM-DD")
                          : formatDate(o.fromDate, "YYYY-MM-DD")
                      ),
                    speciesTrait,
                    traitType
                  };
                }
                return {
                  defaultValue: factsList
                    ?.filter((v) => v.nameId === speciesTrait.traits?.traitId)
                    .map((o) => o.value),
                  speciesTrait,
                  traitType
                };

              case TRAIT_TYPES.MULTIPLE_CATEGORICAL:
                if (speciesTrait.traits?.dataType == "COLOR") {
                  return {
                    defaultValue: factsList
                      ?.filter((v) => v.nameId === speciesTrait.traits?.traitId)
                      .map((v) => v.value),
                    speciesTrait,
                    traitType
                  };
                } else {
                  return {
                    defaultValue: factsList
                      ?.filter((v) => v.nameId === speciesTrait.traits?.traitId)
                      .map((v) => v.valueId),
                    speciesTrait,
                    traitType
                  };
                }

              default:
                return { defaultValue: null, speciesTrait };
            }
          })
        : []
    );
  }, [factsList, speciesTraitsList]);

  return (
    <Box p={4} pb={0}>
      {newTraitsList.map(({ defaultValue, speciesTrait, traitType }) => (
        <Trait
          key={speciesTrait.traits.id}
          speciesTrait={speciesTrait}
          defaultValue={defaultValue}
          observationId={observationId}
          authorId={authorId}
          traitType={traitType}
        />
      ))}
    </Box>
  );
}
