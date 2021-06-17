import {
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  useDisclosure
} from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import ErrorMessage from "@components/form/common/error-message";
import { fromDMS, toDMS } from "dmsformat";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

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
  const { isOpen, onToggle } = useDisclosure();
  const [latDMS, setLatDMS] = useState("");
  const [lngDMS, setLngDMS] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const [lat1, lng1] = toDMS([lat, lng], undefined, { latLonSeparator: "-" }).split("-");
    setLatDMS(lat1);
    setLngDMS(lng1);
  }, [lat, lng]);

  useEffect(() => {
    try {
      const [lat1, lng1] = fromDMS(`${latDMS} ${lngDMS}`);
      setCoordinates({ lat: lat1, lng: lng1 });
    } catch (e) {
      // Parse Error
    }
  }, [latDMS, lngDMS]);

  const setLat = (e) => {
    const value = e.target.value;
    if (isOpen) {
      setLatDMS(value);
    } else {
      setCoordinates({ lat: value, lng });
    }
  };

  const setLng = (e) => {
    const value = e.target.value;
    if (isOpen) {
      setLngDMS(value);
    } else {
      setCoordinates({ lng: value, lat });
    }
  };

  return (
    <Collapse in={show}>
      <FormControl
        mb={4}
        isInvalid={
          (form.formState.errors[fk.latitude.name] || form.formState.errors[fk.longitude.name]) &&
          true
        }
        isRequired={true}
      >
        <FormLabel htmlFor="coordinates">
          {t("observation:coordinates")}
          <Button variant="link" colorScheme="blue" size="xs" ml={2} onClick={onToggle}>
            {t(`observation.use_${isOpen ? "lat_lng" : "dms"}`)}
          </Button>
        </FormLabel>

        <InputGroup id="coordinates">
          <Input
            id="lat"
            roundedRight={0}
            placeholder={t("observation:latitude")}
            value={isOpen ? latDMS : lat}
            onChange={setLat}
          />
          <Input
            id="lng"
            roundedLeft={0}
            placeholder={t("observation:longitude")}
            value={isOpen ? lngDMS : lng}
            onChange={setLng}
            borderLeft={0}
          />
        </InputGroup>
        <ErrorMessage name={fk.latitude.name} errors={form.formState.errors} />
        <ErrorMessage name={fk.longitude.name} errors={form.formState.errors} />
        {isOpen && (
          <FormHelperText>
            Enter values in given format for example <code>0° 0&apos; 0.00000&quot; S</code>
          </FormHelperText>
        )}
      </FormControl>
      <CheckboxField
        mt={2}
        name="hidePreciseLocation"
        label={t("observation:hide_precise_location")}
      />
    </Collapse>
  );
}
