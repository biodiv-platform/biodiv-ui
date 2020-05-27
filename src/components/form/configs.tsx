import { IconButton } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export const selectStyles = {
  control: (p) => ({
    ...p,
    cursor: "text",
    borderColor: "var(--gray-300)"
  }),
  placeholder: (p) => ({
    ...p,
    color: "#757474"
  }),
  valueContainer: (p) => ({ ...p, height: "38px" }),
  menu: (p) => ({ ...p, zIndex: 3 }),
  clearIndicator: (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isFocused ? "blue" : "black"
  })
};

export const ClearIndicator = (props) => {
  const {
    getStyles,
    innerProps: { ref, ...restInnerProps }
  } = props;
  const { t } = useTranslation();
  return (
    <div {...restInnerProps} ref={ref} style={getStyles("clearIndicator", props)}>
      <div
        style={{ lineHeight: "1rem" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Tooltip hasArrow={true} title={t("COPY")}>
          <IconButton
            type="button"
            variant="link"
            icon="copy"
            aria-label={t("COPY")}
            onClick={() => {
              navigator.clipboard.writeText(props.selectProps.value.label);
            }}
          />
        </Tooltip>
      </div>
      <IconButton
        minW="auto"
        type="button"
        variant="link"
        mr={1}
        aria-label={t("CLEAR")}
        icon="close"
        fontSize="0.8rem"
      />
    </div>
  );
};
