import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT, mapStyles } from "@static/constants";
import { hasAccess } from "@utils/auth";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const NakshaMaplibreLayers: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreLayers),
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
  const mapCenter = React.useMemo(() => getMapCenter(3.5), []);
  const canManagePublishing = isLoggedIn && hasAccess([Role.Admin]);
  const { lang } = useTranslation();

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
    <NakshaMaplibreLayers
      defaultViewState={mapCenter}
      loadToC={true}
      lang={lang}
      managePublishing={canManagePublishing}
      nakshaApiEndpoint={ENDPOINT.NAKSHA}
      geoserver={{
        endpoint: ENDPOINT.GEOSERVER,
        store: SITE_CONFIG.GEOSERVER.STORE,
        workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
      }}
      selectedLayers={geoserverLayers}
      mapStyles={mapStyles}
      layers={[
        {
          id: "global-observations",
          title: "Observations",
          description: "All observations from this portal",
          attribution: "Portal and Contributors",
          tags: ["Global", "Observations"],
          source: { type: "grid", fetcher: fetchGridData },
          onHover: onObservationGridHover,
          data: {
            index: "extended_observation",
            type: "extended_records",
            geoField: "location",
            summaryColumn: ["count"],
            propertyMap: { count: "Count" }
          },
          zoomToFit: userGroupId ? true : false
        }
      ]}
    />
  );
}
