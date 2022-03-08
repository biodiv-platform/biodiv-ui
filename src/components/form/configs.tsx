import { CloseIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export const selectStyles = {
  control: (p) => ({
    ...p,
    cursor: "text",
    borderColor: "var(--chakra-colors-gray-300)"
  }),
  placeholder: (p) => ({
    ...p,
    color: "#757474"
  }),
  valueContainer: (p) => ({ ...p, height: "38px" }),
  menu: (p) => ({ ...p, minWidth: "20em" }),
  menuList:(p)=>({...p,maxHeight:"9em"}),
  menuPortal: (p) => ({ ...p, zIndex: 1900 }),
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
        <Tooltip hasArrow={true} title={t("common:copy")}>
          <IconButton
            type="button"
            variant="link"
            icon={<CopyIcon />}
            aria-label={t("common:copy")}
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
        aria-label={t("common:clear")}
        icon={<CloseIcon />}
        fontSize="0.8rem"
      />
    </div>
  );
};
