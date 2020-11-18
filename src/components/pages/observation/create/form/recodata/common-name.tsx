import { Badge, Box, Flex, Image, Stack } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { ExtendedTaxonDefinition } from "@interfaces/esmodule";
import { axSearchSpeciesByText } from "@services/esmodule.service";
import { TAXON_BADGE_COLORS } from "@static/constants";
import { getSpeciesIcon, getSuggestionIcon } from "@utils/media";
import React from "react";
import { components } from "react-select";

export const CommonNameOption = ({ children, ...props }) => {
  const hiddenIcon = !props.data["__isNew__"];
  return (
    <components.Option {...props}>
      <Stack isInline={true} alignItems="center">
        {hiddenIcon && (
          <Image
            boxSize="2rem"
            src={getSuggestionIcon(props.data.icon)}
            fallbackSrc={props.data.group}
          />
        )}
        <Box>
          <Flex alignItems="center">
            {children}
            {props.data.lang && (
              <Badge colorScheme="red" ml={1}>
                {props.data.lang}
              </Badge>
            )}
          </Flex>
          {props.data.sLabel && (
            <Box fontSize="sm" lineHeight="1rem" color="gray.600">
              {props.data.sLabel}
              <Badge colorScheme={TAXON_BADGE_COLORS[props.data.sStatus]} ml={1}>
                {props.data.sStatus}
              </Badge>
              <Badge colorScheme={TAXON_BADGE_COLORS[props.data.sPosition]} ml={1}>
                {props.data.sPosition}
              </Badge>
            </Box>
          )}
        </Box>
      </Stack>
    </components.Option>
  );
};

export const getCommonNameOption = (cv, mcv, updateScientific = true) => ({
  value: cv.name,
  label: cv.name,
  sValue: mcv.id,
  sLabel: mcv.name,
  sStatus: mcv.status,
  sPosition: mcv.position,
  icon: mcv.repr_image_url,
  groupId: mcv.group_id,
  lang: cv.language_name,
  langId: cv.language_id || SITE_CONFIG.LANG.DEFAULT_ID,
  group: getSpeciesIcon(mcv.group_name),
  updateScientific
});

export const onCommonNameQuery = async (q) => {
  if (q.length < 3) {
    return;
  }
  const { data }: { data: ExtendedTaxonDefinition[] } = await axSearchSpeciesByText(
    q,
    "common_name"
  );
  return data.reduce(
    (macc, mcv) =>
      (mcv.common_names || []).reduce((acc, cv) => {
        const iOpts = [];
        if (cv.name.toLowerCase().includes(q.toLowerCase())) {
          iOpts.push(getCommonNameOption(cv, mcv));
        }
        return [...acc, ...iOpts];
      }, macc),
    []
  );
};
