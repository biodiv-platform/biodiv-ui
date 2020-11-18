import GeoJSONPreview from "@components/@core/map-preview/geojson";
import React from "react";

export default function UserLocationMap({ coordinates }) {
  return coordinates[0] ? (
    <GeoJSONPreview
      h="12rem"
      data={{
        type: "Point",
        coordinates
      }}
      maxZoom={8}
      mb={4}
    />
  ) : null;
}
