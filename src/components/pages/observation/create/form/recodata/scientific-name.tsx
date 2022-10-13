import { Badge, Box, Image, Stack, Text } from "@chakra-ui/react";
import { ExtendedTaxonDefinition } from "@interfaces/esmodule";
import { axSearchSpeciesByText } from "@services/esmodule.service";
import { TAXON_BADGE_COLORS } from "@static/constants";
import { getLocalIcon, getSuggestionIcon } from "@utils/media";
import React from "react";
import { components } from "react-select";

export const ScientificNameOption = ({ children, ...props }: any) => {
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
          {children}
          {props.data.acceptedNames && <Text color="gray.600">{props.data.acceptedNames}</Text>}
          <Stack isInline={true} mt={1} spacing={2}>
            {props.data.rank && <Badge>{props.data.rank}</Badge>}
            {props.data.status && (
              <Badge colorScheme={TAXON_BADGE_COLORS[props.data.status]}>{props.data.status}</Badge>
            )}
            {props.data.position && (
              <Badge colorScheme={TAXON_BADGE_COLORS[props.data.position]}>
                {props.data.position}
              </Badge>
            )}
          </Stack>
        </Box>
      </Stack>
    </components.Option>
  );
};

export const onScientificNameQuery = async (q, valueKey = "id") => {
  if (q.length < 3) {
    return;
  }
  const { data }: { data: ExtendedTaxonDefinition[] } = await axSearchSpeciesByText(q, "name");
  return data.map((o) => ({
    value: o[valueKey],
    label: o.name,
    position: o.position,
    status: o.status,
    groupId: o.group_id,
    acceptedNames:
      Array.isArray(o.accepted_names) && o.accepted_names.length ? o.accepted_names[0] : "",
    rank: o.rank,
    group: getLocalIcon(o.group_name),
    raw: o,
    taxonId: o.id,
    hierarchy: o.hierarchy
  }));
};
