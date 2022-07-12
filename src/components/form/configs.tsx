import { CloseIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export const reactSelectProps = {
  styles: {
    control: (p) => ({ ...p, cursor: "text", borderRadius: "var(--chakra-radii-md)" }),
    valueContainer: (p) => ({ ...p, height: "38px" }),
    menu: (p) => ({ ...p, minWidth: "20em" }),
    menuPortal: (p) => ({ ...p, zIndex: 1900 }),
    clearIndicator: (p) => ({ ...p, paddingLeft: 0 }),
  },
  theme: (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      neutral50: "var(--chakra-colors-gray-500)",
      neutral20: "var(--chakra-colors-gray-300)",
      primary25: "var(--chakra-colors-gray-100)",
      primary: "var(--chakra-colors-blue-500)"
    }
  })
};

/**
 *
 * @deprecated using `reactSelectProps` instead
 * @type {*}
 * */
export const selectStyles = reactSelectProps.styles;

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
            minW={0}
            mr={2}
            mt={1}
            variant="link"
            icon={<CopyIcon />}
            aria-label={t("common:copy")}
            onClick={() => navigator.clipboard.writeText(props.selectProps.value.label)}
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
