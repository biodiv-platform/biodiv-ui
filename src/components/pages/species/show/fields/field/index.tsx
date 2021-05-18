import { Box, Stack } from "@chakra-ui/layout";
import { SpeciesField } from "@interfaces/custom";
import { SPECIES_FIELD_DELETED, SPECIES_FIELD_UPDATED } from "@static/events";
import React, { useEffect, useState } from "react";
import { useListener } from "react-gbus";
import { useImmer } from "use-immer";

import useSpecies from "../../use-species";
import SpeciesTraitView from "../traits";
import useSpeciesFields from "../use-species-field";
import DocumentsField from "./documents";
import SpeciesFieldHeading from "./heading";
import OccuranceRecoardSpeciesField from "./occurance-records";
import ReferencesField from "./references";
import SpeciesFieldSimple from "./simple";
import SpeciesFieldSimpleCreate from "./simple/create";

interface SpeciesFieldGroupProps extends SpeciesField {
  valueCallback;
  level: number;
}

export default function SpeciesFieldGroup({
  parentField,
  childField,
  valueCallback,
  level
}: SpeciesFieldGroupProps) {
  const { showHiddenFields } = useSpeciesFields();
  const [childFieldsHasValue, setChildFieldsHasValue] = useState<boolean>();
  const { permissions } = useSpecies();

  const [currentField, setCurrentField] = useImmer<any>(parentField);

  // subscription for created or updated field
  useListener(
    (field) => {
      if (currentField.id === field.fieldId) {
        setCurrentField((_draft) => {
          const idx = _draft.values.findIndex((o) => o.id === field.id);
          if (idx !== -1) {
            _draft.values[idx] = field;
          } else {
            _draft.values.unshift(field);
          }
        });
      }
    },
    [SPECIES_FIELD_UPDATED]
  );

  // subscription for deleted field
  useListener(
    (field) => {
      if (currentField.id === field.fieldId) {
        setCurrentField((_draft) => {
          const idx = _draft.values.findIndex((o) => o.id === field.id);
          if (idx !== -1) {
            _draft.values.splice(idx, 1);
          }
        });
      }
    },
    [SPECIES_FIELD_DELETED]
  );

  useEffect(() => {
    if (
      (currentField.values.length || currentField.traits.length || childFieldsHasValue) &&
      valueCallback
    ) {
      setChildFieldsHasValue(true);
      valueCallback(true);
    }
  }, [currentField, childFieldsHasValue]);

  // References
  if (parentField.id === 81) {
    return <ReferencesField currentField={currentField} parentField={parentField} level={level} />;
  }

  // Documents
  if (parentField.id === 82) {
    return <DocumentsField />;
  }

  // ParentField
  if (parentField.id === 65) {
    return <OccuranceRecoardSpeciesField valueCallback={setChildFieldsHasValue} />;
  }

  return (
    <Box>
      <div data-hidden={!childFieldsHasValue && !showHiddenFields} style={{ overflow: "initial" }}>
        <Stack spacing={3} mb={6}>
          {/* Field Heading */}
          <SpeciesFieldHeading id={parentField?.header} title={parentField?.header} level={level} />

          {/* Create Field */}
          {permissions.isContributor && childField.length === 0 && (
            <SpeciesFieldSimpleCreate fieldId={parentField?.id} />
          )}

          {/* Field Traits */}
          {currentField.traits.map((trait) => (
            <SpeciesTraitView
              key={trait.id}
              trait={trait}
              setShowCategory={setChildFieldsHasValue}
            />
          ))}

          {/* Field Content */}
          {currentField.values.map((value) => (
            <SpeciesFieldSimple key={value.id} value={value} />
          ))}
        </Stack>
      </div>

      {childField.map((field) => (
        <SpeciesFieldGroup
          key={field.parentField?.id}
          valueCallback={setChildFieldsHasValue}
          {...field}
          level={level + 1}
        />
      ))}
    </Box>
  );
}
