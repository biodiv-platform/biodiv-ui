import { ENDPOINT, MAP_CENTER } from "@static/constants";
import { useStoreState } from "easy-peasy";
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
  const userGroupId = useStoreState((s) => s.currentGroup?.id) || undefined;

  return (
    <Naksha
      viewPort={{
        latitude: MAP_CENTER.lat,
        longitude: MAP_CENTER.lng,
        zoom: 3.4,
        bearing: 0,
        pitch: 0
      }}
      loadToC={false}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      nakshaApiEndpoint={ENDPOINT.NAKSHA}
      geoserver={{ endpoint: ENDPOINT.GEOSERVER, store: "ibp", workspace: "biodiv" }}
      layers={[
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
      ]}
    />
  );
}
