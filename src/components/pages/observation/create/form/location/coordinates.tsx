import { Collapsible, Input } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import ErrorMessage from "@components/form/common/error-message";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

interface ICoordinatesProps {
  show: boolean;
  fk;
  coordinates;
  setCoordinates;
}

export default function CoordinatesInput({
  show,
  fk,
  coordinates: { lat, lng },
  setCoordinates
}: ICoordinatesProps) {
  const form = useFormContext();
  const { t } = useTranslation();

  const setLat = (e) => setCoordinates({ lat: e.target.value, lng });
  const setLng = (e) => setCoordinates({ lng: e.target.value, lat });

  return (
    <Collapsible.Root open={show}>
      <Collapsible.Content>
        <Field
          mb={4}
          invalid={
            (form.formState.errors[fk.latitude.name] || form.formState.errors[fk.longitude.name]) &&
            true
          }
          required={true}
          htmlFor="coordinates"
          label={t("observation:coordinates")}
        >
          <InputGroup id="coordinates">
            <>
              <Input
                id="lat"
                roundedRight={0}
                placeholder={t("observation:latitude")}
                value={lat}
                onChange={setLat}
              />
              <Input
                id="lng"
                roundedLeft={0}
                placeholder={t("observation:longitude")}
                value={lng}
                onChange={setLng}
                borderLeft={0}
              />
            </>
          </InputGroup>
          <ErrorMessage name={fk.latitude.name} errors={form.formState.errors} />
          <ErrorMessage name={fk.longitude.name} errors={form.formState.errors} />
        </Field>
        <CheckboxField
          mt={2}
          name="hidePreciseLocation"
          label={t("observation:hide_precise_location")}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
