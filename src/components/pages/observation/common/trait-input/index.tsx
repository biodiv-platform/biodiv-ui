import { Box } from "@chakra-ui/core";
import { TraitsValue } from "@interfaces/observation";
import { TRAIT_TYPES } from "@static/constants";
import React from "react";

import MultipleCategorialTrait from "./multiple-categorical";
import SingleCategorialTrait from "./single-categorical";

export interface ITraitInputProps {
  type: string;
  values: TraitsValue[];
  gridColumns?;
  onUpdate;
  defaultValue?;
}

const TraitInput = (props: ITraitInputProps) => {
  switch (props.type) {
    case TRAIT_TYPES.SINGLE_CATEGORICAL:
      return <SingleCategorialTrait {...props} />;

    case TRAIT_TYPES.MULTIPLE_CATEGORICAL:
      return <MultipleCategorialTrait {...props} />;

    default:
      return <Box>Unknown Input</Box>;
  }
};

export default TraitInput;
