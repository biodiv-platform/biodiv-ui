import { Box } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import { getLocalIcon } from "@utils/media";
import React from "react";

const CustomRadio = (props) => {
  return (
    <RadioCard.Item value={props.value}>
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl>
        <Tooltip title={props.icon} positioning={{ placement: "top" }} showArrow={true}>
          <Box
            p={1}
            cursor="pointer"
            borderWidth="2px"
            borderRadius="md"
            borderColor={props.isChecked ? "blue.500" : "transparent"}
            bg={props.checked ? "blue.50" : "white"}
            _focus={{
              boxShadow: "outline"
            }}
            className="fade"
          >
            <img
              style={{
                width: "2.6rem",
                height: "2.6rem",
                filter: props.isChecked ? "none" : "grayscale(1)"
              }}
              src={getLocalIcon(props.icon)}
              alt={props.icon}
            />
          </Box>
        </Tooltip>
      </RadioCard.ItemControl>
    </RadioCard.Item>
  );
};

export default CustomRadio;
