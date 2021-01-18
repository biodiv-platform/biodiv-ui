import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import { getBearerToken } from "@utils/http";
import { getMapCenter } from "@utils/location";
import notification, { NotificationType } from "@utils/notification";
import dynamic from "next/dynamic";
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

  const onObservationGridHover = ({ feature }) => (
    <div>{feature?.properties?.count} Observations</div>
  );

  const handleOnDownload = async () => {
    await waitForAuth();
    const token = await getBearerToken();
    if (token) {
      notification(t("PAGE.MAIL.SENT"), NotificationType.Success);
      return { success: true, data: token };
    }
    return { success: false, data: token };
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
        layers={
          SITE_CONFIG.MAP.DEFAULT_LAYERS
            ? [
                {
                  id: "global-observations",
                  title: "Observations",
                  description: "All observations from india biodiversity portal",
                  attribution: "indiabiodiversity.org and Contributors",
                  tags: ["Global", "Observations"],
                  isAdded: false,
                  source: {
                    type: "grid",
                    endpoint: `${ENDPOINT.ESMODULE}/v1/geo/aggregation`
                  },
                  data: {
                    index: "extended_observation",
                    type: "_doc",
                    geoField: "location"
                  },
                  onHover: onObservationGridHover
                }
              ]
            : []
        }
      />
    </Box>
  );
}
