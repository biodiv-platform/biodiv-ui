import { Box, Collapse } from "@chakra-ui/react";
import { DrawingManager, GoogleMap } from "@react-google-maps/api";
import React from "react";

import Marker from "./marker";

const mapContainerStyle = {
  height: "380px",
  width: "100%"
};

const LocationMap = ({ coordinates, setCoordinates, isOpen, onTextUpdate, zoom, center }) => {
  const onMarkerComplete = (marker) => {
    setCoordinates({ lat: marker.position.lat(), lng: marker.position.lng() });
    marker.setMap(null);
  };

  return (
    <Collapse in={isOpen}>
      <Box borderRadius="md" overflow="hidden" mb={4}>
        <GoogleMap
          id="observation-create-map"
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={center}
        >
          <DrawingManager
            options={
              {
                drawingControl: true,
                drawingControlOptions: {
                  drawingModes: ["marker"]
                }
              } as any
            }
            onMarkerComplete={onMarkerComplete}
          />
          <Marker
            position={coordinates}
            setCoordinates={setCoordinates}
            onTextUpdate={onTextUpdate}
          />
        </GoogleMap>
      </Box>
    </Collapse>
  );
};

export default LocationMap;
