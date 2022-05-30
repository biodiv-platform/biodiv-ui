import "leaflet/dist/leaflet.css";

import { Box, Collapse } from "@chakra-ui/react";
import { LEAFLET_MARKER_ICON } from "@static/constants";
import L from "leaflet";
import { LatLngBoundsExpression } from "leaflet";
import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import { TileLayer } from "react-leaflet";

const onMarkerClickHandler = (
  row,
  suggestion,
  setLatitude,
  setLongitude,
  setLocationAccuracy,
  hForm,
  locationRef
) => {
  setLatitude(suggestion.coordinates[1]);
  setLongitude(suggestion.coordinates[0]);
  setLocationAccuracy(suggestion.locationAccuracy);
  hForm.setValue("longitude", suggestion.coordinates ? suggestion.coordinates[0] : row.longitude);
  hForm.setValue("latitude", suggestion.coordinates ? suggestion.coordinates[1] : row.latitude);
  hForm.setValue(
    "locationAccuracy",
    suggestion.locationAccuracy ? suggestion.locationAccuracy : row.locationAccuracy
  );
  locationRef.current.onChange(
    {
      value: suggestion.label,
      label: suggestion.label,
      coordinates: suggestion.coordinates,
      locationAccuracy: suggestion.locationAccuracy
    },
    { name: locationRef.current.props.inputId }
  );
};

const MapSuggedtedLocations = ({
  row,
  setLatitude,
  setLongitude,
  setLocationAccuracy,
  hForm,
  locationRef,
  isOpen
}) => {
  const allLatitudes = row.peliasLocations
    ? row.peliasLocations.map((suggestion) => suggestion.coordinates[1])
    : [];
  const allLongitudes = row.peliasLocations
    ? row.peliasLocations.map((suggestion) => suggestion.coordinates[0])
    : [];
  const mapBounds: LatLngBoundsExpression = [
    [Math.min(...allLatitudes) - 1, Math.min(...allLongitudes) - 1],
    [Math.max(...allLatitudes) + 1, Math.max(...allLongitudes) + 1]
  ];
  return (
    <Box>
      <Collapse in={isOpen}>
        {row.peliasLocations && (
          <Box position="relative" h={500} overflow="hidden" mb={5} borderRadius="md">
            <MapContainer
              bounds={mapBounds}
              key="map"
              // center={[20.5937, 78.9629]}
              zoom={4}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                key="tile"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {row.peliasLocations.map((suggestion) => (
                <Marker
                  key={suggestion.coordinates.toString()}
                  eventHandlers={{
                    click: () => {
                      onMarkerClickHandler(
                        row,
                        suggestion,
                        setLatitude,
                        setLongitude,
                        setLocationAccuracy,
                        hForm,
                        locationRef
                      );
                    }
                  }}
                  riseOnHover={true}
                  position={[suggestion.coordinates[1], suggestion.coordinates[0]]}
                  icon={L.icon(LEAFLET_MARKER_ICON)}
                >
                  <Tooltip>{suggestion.label}</Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default MapSuggedtedLocations;
