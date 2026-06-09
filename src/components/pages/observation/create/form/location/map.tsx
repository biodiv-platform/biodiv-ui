import { Box, Collapsible } from "@chakra-ui/react";
import { GoogleMap } from "@react-google-maps/api";
import React from "react";

import Marker from "./marker";

const mapContainerStyle = {
  height: "380px",
  width: "100%"
};

const LocationMap = ({ coordinates, setCoordinates, isOpen, onTextUpdate, zoom, center }) => {
  const handleMapClick = (event) => {
    setCoordinates({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  return (
    <Collapsible.Root open={isOpen}>
      <Collapsible.Content>
        <Box borderRadius="md" overflow="hidden" mb={4}>
          <GoogleMap
            id="observation-create-map"
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
            onClick={handleMapClick}
          >
            <Marker
              position={coordinates}
              setCoordinates={setCoordinates}
              onTextUpdate={onTextUpdate}
            />
          </GoogleMap>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default LocationMap;
