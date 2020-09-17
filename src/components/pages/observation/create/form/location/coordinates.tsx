import {
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  useDisclosure
} from "@chakra-ui/core";
import CheckBox from "@components/form/checkbox";
import ErrorMessage from "@components/form/common/error-message";
import useTranslation from "@configs/i18n/useTranslation";
import { fromDMS, toDMS } from "dmsformat";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

interface ICoordinatesProps {
  show: boolean;
  fk;
  form: UseFormMethods<Record<string, any>>;
  coordinates;
  setCoordinates;
}

export default function CoordinatesInput({
  show,
  fk,
  form,
  coordinates: { lat, lng },
  setCoordinates
}: ICoordinatesProps) {
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
    <Collapse isOpen={show}>
      <FormControl
        mb={4}
        isInvalid={(form.errors[fk.latitude.name] || form.errors[fk.longitude.name]) && true}
        isRequired={true}
      >
        <FormLabel htmlFor="coordinates">
          {t("OBSERVATION.COORDINATES")}
          <Button variant="link" variantColor="blue" size="xs" ml={2} onClick={onToggle}>
            {t(`OBSERVATION.USE_${isOpen ? "LAT_LNG" : "DMS"}`)}
          </Button>
        </FormLabel>

        <InputGroup id="coordinates">
          <Input
            roundedRight={0}
            placeholder={t("OBSERVATION.LATITUDE")}
            value={isOpen ? latDMS : lat}
            onChange={setLat}
          />
          <Input
            roundedLeft={0}
            placeholder={t("OBSERVATION.LONGITUDE")}
            value={isOpen ? lngDMS : lng}
            onChange={setLng}
            borderLeft={0}
          />
        </InputGroup>
        <ErrorMessage name={fk.latitude.name} errors={form.errors} />
        <ErrorMessage name={fk.longitude.name} errors={form.errors} />
        {isOpen && (
          <FormHelperText>
            Enter values in given format for example <code>0° 0&apos; 0.00000&quot; S</code>
          </FormHelperText>
        )}
      </FormControl>
      <CheckBox
        mt={2}
        name="hidePreciseLocation"
        label={t("OBSERVATION.HIDE_PRECISE_LOCATION")}
        form={form}
      />
    </Collapse>
  );
}
