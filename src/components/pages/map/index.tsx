import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT } from "@static/constants";
import { hasAccess, waitForAuth } from "@utils/auth";
import { getBearerToken } from "@utils/http";
import { getMapCenter } from "@utils/location";
import notification, { NotificationType } from "@utils/notification";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const NakshaMapboxList: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxList),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export default function MapPageComponent() {
  const defaultViewPort = React.useMemo(() => getMapCenter(3.1), []);
  const { t } = useTranslation();
  const { user } = useGlobalState();
  const isAdmin = hasAccess([Role.Admin]);

  const onObservationGridHover = ({ feature }) => (
    <div>{feature?.properties?.count} Observations</div>
  );

  const handleOnDownload = async () => {
    await waitForAuth();
    const token = await getBearerToken();
    if (token) {
      notification(t("page:mail.sent"), NotificationType.Success);
      return { success: true, data: token };
    }
    return { success: false, data: token };
  };

  const fetchGridData = async (geoProps) => {
    const params = {
      ...geoProps,
      view: "map",
      geoField: "location"
    };

    const { data } = await axGetObservationMapData(params);
    return data;
  };

  return (
    <Box height="calc(100vh - var(--heading-height))" overflow="hidden" position="relative">
      <NakshaMapboxList
        viewPort={defaultViewPort}
        loadToC={true}
        showToC={true}
        nakshaEndpointToken={`Bearer ${user.accessToken}`}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        nakshaApiEndpoint={ENDPOINT.NAKSHA}
        onLayerDownload={handleOnDownload}
        geoserver={{
          endpoint: ENDPOINT.GEOSERVER,
          store: SITE_CONFIG.GEOSERVER.STORE,
          workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
        }}
        managePublishing={isAdmin}
        layers={
          SITE_CONFIG.MAP.DEFAULT_LAYERS
            ? [
                {
                  id: "global-observations",
                  title: "Observations",
                  description: "All observations from this portal",
                  attribution: "Portal and Contributors",
                  tags: ["Global", "Observations"],
                  isAdded: false,
                  source: { type: "grid", fetcher: fetchGridData },
                  onHover: onObservationGridHover
                }
              ]
            : []
        }
      />
    </Box>
  );
}
