import { Button, List, ListItem, useDisclosure } from "@chakra-ui/react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { reverseGeocode } from "@utils/location";

const CustomMarker = ({ position, setCoordinates, onTextUpdate }) => {
  const [markerRef, setMarkerRef] = useState();
  const [suggestons, setSuggestions] = useState<{ formatted_address; place_id }[]>([]);
  const { isOpen, onClose, onToggle } = useDisclosure();

  useEffect(() => {
    setSuggestions([]);
  }, [position]);

  useEffect(() => {
    if (isOpen) {
      reverseGeocode(position).then((results) => setSuggestions(results));
    }
  }, [position, isOpen]);

  const onMarkerDrag = ({ latLng }) => {
    setCoordinates({ lat: latLng.lat(), lng: latLng.lng() });
  };

  const setTitle = (a) => {
    onTextUpdate(a);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <InfoWindow anchor={markerRef} onCloseClick={onClose}>
          <List styleType="disc">
            {suggestons.map(({ formatted_address, place_id }) => (
              <ListItem key={place_id}>
                {formatted_address}
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="xs"
                  onClick={() => setTitle(formatted_address)}
                >
                  Use as title
                </Button>
              </ListItem>
            ))}
          </List>
        </InfoWindow>
      )}
      {position && (
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
