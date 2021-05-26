import { Image } from "@chakra-ui/react";
import { SpeciesGroup } from "@interfaces/observation";
import { getLocalIcon } from "@utils/media";
import React from "react";

interface ISpeciesGroupsProps {
  id;
  speciesGroups: SpeciesGroup[] | undefined;
}

export default function SpeciesGroupBoxForExternalObs({ id, speciesGroups }: ISpeciesGroupsProps) {
  const options = speciesGroups?.map((g) => ({ label: g.name, value: g.id }));
  const finalType = options?.find((o) => o.value === id);
  //const [type, setType] = useState(finalType);

  return <Image title={finalType?.label} boxSize="2.5rem" src={getLocalIcon(finalType?.label)} />;
}
