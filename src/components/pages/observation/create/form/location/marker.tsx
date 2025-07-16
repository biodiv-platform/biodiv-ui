import { Button, List, useDisclosure } from "@chakra-ui/react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import { reverseGeocode } from "@utils/location";
import React, { useEffect, useState } from "react";

const CustomMarker = ({ position, setCoordinates, onTextUpdate }) => {
  const [markerRef, setMarkerRef] = useState<any>();
  const [suggestons, setSuggestions] = useState<{ formatted_address; place_id }[]>([]);
  const { open, onClose, onToggle } = useDisclosure();

  useEffect(() => {
    setSuggestions([]);
  }, [position]);

  useEffect(() => {
    if (open) {
      reverseGeocode(position).then((results) => setSuggestions(results));
    }
  }, [position, open]);

  const onMarkerDrag = ({ latLng }) => {
    setCoordinates({ lat: latLng.lat(), lng: latLng.lng() });
  };

  const setTitle = (a) => {
    onTextUpdate(a);
    onClose();
  };

  return (
    <>
      {open && (
        <InfoWindow anchor={markerRef} onCloseClick={onClose}>
          <List.Root listStyle="decimal">
            {suggestons.map(({ formatted_address, place_id }) => (
              <List.Item key={place_id}>
                {formatted_address}
                <Button
                  variant="plain"
                  colorPalette="blue"
                  size="xs"
                  onClick={() => setTitle(formatted_address)}
                >
                  Use as title
                </Button>
              </List.Item>
            ))}
          </List.Root>
        </InfoWindow>
      )}
      {position?.lat && (
        <Marker
          position={position}
          draggable={true}
          onDragEnd={onMarkerDrag}
          onLoad={setMarkerRef}
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default CustomMarker;
