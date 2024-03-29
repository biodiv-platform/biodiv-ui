import { Box } from "@chakra-ui/react";
import { TraitsValue } from "@interfaces/observation";
import { TRAIT_TYPES } from "@static/constants";
import React from "react";

import MultipleCategorialTrait from "./multiple-categorical";
import RangeTrait from "./range";
import SingleCategorialTrait from "./single-categorical";

export interface ITraitInputProps {
  name?: string;
  type?: string;
  values?: TraitsValue[];
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

    case TRAIT_TYPES.RANGE:
      return <RangeTrait {...props} />;

    default:
      return <Box>Unknown Input</Box>;
  }
};

export default TraitInput;
