import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import { getBearerToken } from "@utils/http";
import { getMapCenter } from "@utils/location";
import notification, { NotificationType } from "@utils/notification";
import dynamic from "next/dynamic";
import React from "react";

const Naksha: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.Naksha),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export default function MapPageComponent() {
  const defaultViewPort = React.useMemo(() => getMapCenter(3.1), []);

  const onObservationGridHover = ({ feature }) => (
    <div>{feature?.properties?.count} Observations</div>
  );

  const handleOnDownload = async (layer) => {
    await waitForAuth();
    const token = await getBearerToken();
    if (token) {
      notification(`Mail Sent ${layer.id}`, NotificationType.Success);
      return { success: true, data: token };
    }
    return { success: false, data: token };
  };

  return (
    <Box height="calc(100vh - var(--heading-height))" overflow="hidden" position="relative">
      <Naksha
        viewPort={defaultViewPort}
        loadToC={true}
        showToC={true}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        nakshaApiEndpoint={ENDPOINT.NAKSHA}
        onDownload={handleOnDownload}
        geoserver={{
          endpoint: ENDPOINT.GEOSERVER,
          store: SITE_CONFIG.GEOSERVER.STORE,
          workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
        }}
        layers={[
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
              type: "extended_records",
              geoField: "location"
            },
            onHover: onObservationGridHover
          }
        ]}
      />
    </Box>
  );
}
