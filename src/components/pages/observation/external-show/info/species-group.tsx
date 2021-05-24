import { Image } from "@chakra-ui/react";
import { SpeciesGroup } from "@interfaces/observation";
import { getLocalIcon } from "@utils/media";
import React, { useState } from "react";

interface ISpeciesGroupsProps {
  id;
  speciesGroups: SpeciesGroup[] | undefined;
  observationId;
}

export default function SpeciesGroupBoxForExternalObs({ id, speciesGroups, observationId }: ISpeciesGroupsProps) {
  const options = speciesGroups?.map((g) => ({ label: g.name, value: g.id }));
  const [finalType, setFinalType] = useState(options?.find((o) => o.value === id));
  const [type, setType] = useState(finalType);

  return <Image title={finalType?.label} boxSize="2.5rem" src={getLocalIcon(finalType?.label)} />;
}
