import SITE_CONFIG from "@configs/site-config.json";
import { ENDPOINT } from "@static/constants";
import dynamic from "next/dynamic";
import React from "react";

const Naksha = dynamic(() => import("naksha-components-react"), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

export default function Map({ latitude, longitude }) {
  const marker = [{ latitude, longitude, colorHex: "#000080" }];

  return (
    <Naksha
      viewPort={{
        latitude,
        longitude,
        zoom: 3.4,
        bearing: 0,
        pitch: 0
      }}
      markers={marker}
      loadToC={false}
      mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      nakshaApiEndpoint={ENDPOINT.NAKSHA}
      geoserver={{
        endpoint: ENDPOINT.GEOSERVER,
        store: SITE_CONFIG.GEOSERVER.STORE,
        workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
      }}
    />
  );
}
