import SITE_CONFIG from "@configs/site-config.json";
import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT } from "@static/constants";
import { hasAccess } from "@utils/auth";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React from "react";

const NakshaMapboxList: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxList),
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
  const { currentGroup, isLoggedIn } = useGlobalState();
  const userGroupId = currentGroup?.id || undefined;
  const geoserverLayers: any = SITE_CONFIG.HOME.MAP || [];
  const mapCenter = React.useMemo(() => getMapCenter(3.4), []);
  const canManagePublishing = isLoggedIn && hasAccess([Role.Admin]);

  const fetchGridData = async (geoProps) => {
    const params = {
      ...geoProps,
      userGroupList: userGroupId,
      view: "map",
      geoField: "location"
    };

    const { data } = await axGetObservationMapData(params);
    return data;
  };

  return (
    <NakshaMapboxList
      viewPort={mapCenter}
      loadToC={true}
      managePublishing={canManagePublishing}
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
                description: "All observations from this portal",
                attribution: "Portal and Contributors",
                tags: ["Global", "Observations"],
                isAdded: true,
                source: { type: "grid", fetcher: fetchGridData },
                onHover: onObservationGridHover
              }
            ]
      }
    />
  );
}
