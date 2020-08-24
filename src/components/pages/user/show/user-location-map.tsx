import GeoJSONPreview from "@components/@core/map-preview/geojson";
import React from "react";

export default function UserLocationMap({ coordinates }) {
  return coordinates[0] ? (
    <GeoJSONPreview
      h="12rem"
      viewPort={{ maxZoom: 8 }}
      data={{
        type: "Point",
        coordinates
      }}
    />
  ) : null;
}
