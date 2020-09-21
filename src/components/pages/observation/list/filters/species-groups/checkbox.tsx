import { Box, Image, useCheckbox } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import styled from "@emotion/styled";
import { getSpeciesIcon } from "@utils/media";
import { toHumanString } from "human-readable-numbers";
import React from "react";

const CheckboxLabel = styled.label`
  cursor: pointer;
  border: 1px solid var(--gray-400);
  background: var(--white);

  img {
    filter: grayscale(1);
    margin: 0 auto;
  }

  .badge {
    background: var(--gray-400);
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
      background: var(--blue-500);
    }
  }
`;

const Checkbox = (props: any) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  return (
    <Tooltip label={props.label} hasArrow={true} placement="top">
      <Box
        {...getCheckboxProps()}
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
      >
        <input {...getInputProps()} />
        <Image
          boxSize="2.2rem"
          objectFit="contain"
          src={getSpeciesIcon(props.label)}
          alt={props.label}
          ignoreFallback={true}
        />
        <div className="badge">{toHumanString(props.stat || 0)}</div>
      </Box>
    </Tooltip>
  );
};

// const Checkbox = ({ id, label, value, stat, ...props }) => (
//   <CheckboxLabel role="checkbox">
//     <Tooltip label={label} hasArrow={true} placement="top">
//       <div className="custom-checkbox" aria-checked={props.isChecked}>
//         <VisuallyHidden
//           as="input"
//           type="checkbox"
//           {...props}
//           checked={props.isChecked}
//           value={value}
//         />
//         <Image
//           boxSize="2rem"
//           mr={2}
//           objectFit="contain"
//           src={getSpeciesIcon(label)}
//           alt={label}
//           ignoreFallback={true}
//         />
//       </div>
//     </Tooltip>
//     <div className="badge" aria-checked={props.isChecked}>
//       {toHumanString(stat || 0)}
//     </div>
//   </CheckboxLabel>
// );

export default Checkbox;
