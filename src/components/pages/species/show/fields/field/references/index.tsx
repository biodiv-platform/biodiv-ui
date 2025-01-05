import { Box, ListItem, OrderedList, Stack } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import React, { useMemo } from "react";

import useSpecies from "../../../use-species";
import SpeciesFieldHeading from "../heading";
import SpeciesFieldSimpleCreate from "../simple/create";
import ReferencesShow from "./show";
import { generateReferencesList } from "./utils";

export default function ReferencesField({ currentField, parentField, level }) {
  const { species, permissions } = useSpecies();

  const fieldsRender = useMemo(
    () => generateReferencesList(species.fieldData),
    [species.fieldData]
  );

  return (
    <Stack spacing={3} wordBreak="break-word">
      <SpeciesFieldHeading id={parentField?.header} title={parentField?.header} level={level} />

      {/* Create Field */}
      {permissions.isContributor && (
        <SpeciesFieldSimpleCreate
          fieldId={parentField?.id}
          traits={currentField.traits}
          referencesOnly={true}
        />
      )}

      {/* Field Content */}
      {currentField.values.map((value) => (
        <ReferencesShow key={value.id} value={value} />
      ))}

      {/* Pre Generated References */}
      {fieldsRender.map(([path, references]) => (
        <Box key={path} mb={3}>
          <Box fontWeight={600} fontSize="md" mb={1}>
            {path}
          </Box>
          <OrderedList>
            {references.map(([title, url], index) => (
              <ListItem key={index}>
                {title} {url && <ExternalBlueLink href={url} />}
              </ListItem>
            ))}
          </OrderedList>
        </Box>
      ))}
    </Stack>
  );
}
