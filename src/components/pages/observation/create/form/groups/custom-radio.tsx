import { Box, Image } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import { getLocalIcon } from "@utils/media";
import React from "react";

const CustomRadio = (props) => {
  const isSelected = props.value === props.selectedValue;
  return (
    <RadioCard.Item value={props.value} key={props.value}>
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl>
        <Tooltip title={props.icon} positioning={{ placement: "top" }} showArrow={true}>
          <RadioCard.ItemText>
            <Box>
              <Image
                boxSize="2.6rem"
                style={{
                  filter: isSelected ? "none" : "grayscale(1)",
                  opacity: isSelected ? 1 : 0.7
                }}
                src={getLocalIcon(props.icon)}
                alt={props.icon}
                overflow="hidden"
              />
            </Box>
          </RadioCard.ItemText>
        </Tooltip>
      </RadioCard.ItemControl>
    </RadioCard.Item>
  );
};

export default CustomRadio;
