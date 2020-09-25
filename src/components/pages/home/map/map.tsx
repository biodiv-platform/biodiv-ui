import SITE_CONFIG from "@configs/site-config.json";
import useGlobalState from "@hooks/use-global-state";
import { ENDPOINT } from "@static/constants";
import dynamic from "next/dynamic";
import React from "react";

const Naksha = dynamic(() => import("naksha-components-react"), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const onObservationGridHover = ({ feature }) => (
  <div>{feature?.properties?.count} Observations</div>
);

export default function Map() {
  /**
   * Do not remove `undefined` from `userGroupId`
   * so key will be automatically removed if `null`
   */
  const { currentGroup } = useGlobalState();
  const userGroupId = currentGroup?.id || undefined;
  const geoserverLayers: any[] = SITE_CONFIG.HOME.MAP;

  return (
    <Naksha
      viewPort={{
        zoom: 3.4,
        bearing: 0,
        pitch: 0,
        ...SITE_CONFIG.MAP.CENTER
      }}
      loadToC={false}
      mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      nakshaApiEndpoint={ENDPOINT.NAKSHA}
      geoserver={{
        endpoint: ENDPOINT.GEOSERVER,
        store: SITE_CONFIG.GEOSERVER.STORE,
        workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
      }}
      selectedLayers={geoserverLayers}
      layers={
        geoserverLayers.length
          ? []
          : [
              {
                id: "global-observations",
                title: "Observations",
                isAdded: true,
                source: {
                  type: "grid",
                  endpoint: `${ENDPOINT.ESMODULE}/v1/geo/aggregation`
                },
                data: {
                  index: "extended_observation",
                  type: "extended_records",
                  geoField: "location",
                  userGroupId
                },
                onHover: onObservationGridHover
              }
            ]
      }
    />
  );
}
