import { EXIF_GPS_FOUND } from "@static/events";
import ls from "local-storage-json";
import { useEffect, useState } from "react";
import { emit } from "react-gbus";

const LAST_LOCATION = "ll";

export default function useLastLocation() {
  const [has, setHas] = useState(false);
  const [lastLocation, setLastLocation] = useState<any>({});

  useEffect(() => {
    const ll = ls.get(LAST_LOCATION);
    if (ll) {
      setHas(true);
      setLastLocation(ll);
    }
  }, []);

  const set = (data) => setLastLocation(data);

  const use = (e) => {
    e.preventDefault();
    emit(EXIF_GPS_FOUND, lastLocation);
    setHas(false);
  };

  return {
    has,
    value: lastLocation,
    set,
    use
  };
}

export const setLastData = (lat, lng, address, customFields, customFieldValues) => {
  ls.set(LAST_LOCATION, { lat, lng, address, isLast: true });
  customFields.map(({ customFieldId }, index) => {
    const value = customFieldValues[index].value;
    ls.set(`cf-${customFieldId}`, { value });
  });
};
