import { Box, Image, useCheckbox } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import styled from "@emotion/styled";
import { getLocalIcon } from "@utils/media";
import { toHumanString } from "human-readable-numbers";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const CheckboxLabel = styled.label`
  cursor: pointer;
  border: 1px solid var(--chakra-colors-gray-300);
  background: var(--chakra-colors-white);
  overflow: hidden;

  img {
    filter: grayscale(1);
    margin: 0 auto;
  }

  .badge {
    background: var(--chakra-colors-gray-500);
    font-size: 0.7rem;
    line-height: 1.2rem;
    color: white;
    text-align: center;
  }

  &[aria-checked="true"] {
    img {
      filter: none;
    }
    .badge {
      background: var(--chakra-colors-blue-500);
    }
  }
`;

const Checkbox = (props: any) => {
  const { getControlProps, getLabelProps } = useCheckbox(props);
  const { t } = useTranslation();

  return (
    <Tooltip
      content={t(`filters:species_group.${props.label.toLowerCase()}`)}
      showArrow={true}
      positioning={{ placement: "top" }}
    >
      <Box
        {...getLabelProps()}
        as={CheckboxLabel}
        borderRadius="md"
        aria-checked={props.isChecked}
        _checked={{
          borderColor: "blue.500",
          bg: "blue.50"
        }}
        _focus={{
          boxShadow: "outline"
        }}
        style={undefined}
      >
        <input {...getControlProps()} required={false} />
        <Image
          boxSize="2.2rem"
          objectFit="contain"
          src={getLocalIcon(props.label)}
          alt={props.label}
        />
        <div className="badge">{toHumanString(props.stat || 0)}</div>
      </Box>
    </Tooltip>
  );
};

export default Checkbox;
