import SITE_CONFIG from "@configs/site-config.json";
import useGlobalState from "@hooks/use-global-state";
import { ENDPOINT } from "@static/constants";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React from "react";

const Naksha: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.Naksha),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

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
  const mapCenter = React.useMemo(() => getMapCenter(3.4), []);

  return (
    <Naksha
      viewPort={mapCenter}
      loadToC={true}
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
                description: "All observations from india biodiversity portal",
                attribution: "indiabiodiversity.org and Contributors",
                tags: ["Global", "Observations"],
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
