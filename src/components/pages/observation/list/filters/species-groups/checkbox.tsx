import { Image, VisuallyHidden } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import styled from "@emotion/styled";
import { getSpeciesIcon } from "@utils/media";
import { toHumanString } from "human-readable-numbers";
import React from "react";

const CheckboxLabel = styled.label`
  cursor: pointer;

  .custom-checkbox {
    display: block;
    padding: 0.25rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 0;
  }
  .badge {
    background: var(--gray-400);
    font-size: 0.7rem;
    line-height: 1.2rem;
    color: white;
    text-align: center;
    border-radius: 0.25rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    filter: grayscale(1);
  }
  [aria-checked="true"].badge {
    background: var(--blue-500);
    box-shadow: 0 0 0 1px var(--blue-500);
    filter: none;
  }
  img {
    margin: 0 auto;
  }
`;

const Checkbox = ({ id, label, value, stat, ...props }) => (
  <CheckboxLabel role="checkbox">
    <Tooltip label={label} hasArrow={true} placement="top">
      <div className="custom-checkbox" aria-checked={props.isChecked}>
        <VisuallyHidden
          as="input"
          type="checkbox"
          {...props}
          // @ts-ignore
          checked={props.isChecked}
          value={value}
        />
        <Image
          size="2rem"
          mr={2}
          objectFit="contain"
          src={getSpeciesIcon(label)}
          alt={label}
          ignoreFallback={true}
        />
      </div>
    </Tooltip>
    <div className="badge" aria-checked={props.isChecked}>
      {toHumanString(stat || 0)}
    </div>
  </CheckboxLabel>
);

export default Checkbox;
