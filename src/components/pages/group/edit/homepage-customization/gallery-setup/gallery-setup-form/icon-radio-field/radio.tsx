import { HStack, Image, RadioCard } from "@chakra-ui/react";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React from "react";
interface ITraitInputProps {
  onChange?;
  name;
  options: any[];
  gridColumns?;
  defaultValue?;
}
const RadioItems = ({ options, name, defaultValue, onChange }: ITraitInputProps) => {
  return (
    <RadioCard.Root
      align="center"
      maxW="400px"
      value={defaultValue}
      name={name}
      onValueChange={onChange}
    >
      <HStack>
        {" "}
        {options.map((o) => {
          return (
            <RadioCard.Item key={o.id} value={o.value}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <Image
                  boxSize="5rem"
                  loading="lazy"
                  src={getResourceThumbnail(
                    RESOURCE_CTX.OBSERVATION,
                    o.value,
                    RESOURCE_SIZE.DEFAULT
                  )}
                  alt={o.name}
                />
              </RadioCard.ItemControl>
            </RadioCard.Item>
          );
        })}{" "}
      </HStack>
    </RadioCard.Root>
  );
};
export default RadioItems;
