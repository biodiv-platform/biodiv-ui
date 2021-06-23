import { Box } from "@chakra-ui/layout";
import BoxHeading from "@components/@core/layout/box-heading";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { NakshaMapboxList } from "@ibp/naksha-mapbox-list";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT } from "@static/constants";
import { getMapCenter } from "@utils/location";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const onObservationGridHover = ({ feature }) => (
  <div>{feature?.properties?.count} Observations</div>
);

export default function ObservationsMap() {
  const { filter } = useObservationFilter();
  const { currentGroup } = useGlobalState();
  const userGroupId = currentGroup?.id || undefined;
  const geoserverLayers: any = SITE_CONFIG.HOME.MAP || [];
  const mapCenter = React.useMemo(() => getMapCenter(3.2), []);
  const { t, lang } = useTranslation();

  const fetchGridData = async (geoProps) => {
    const params = {
      ...geoProps,
      ...filter,
      userGroupId,
      view: "map",
      geoField: "location"
    };

    const { data } = await axGetObservationMapData(params);
    return data;
  };

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading>🗺️ {t("observation:list.spatial_distribution")}</BoxHeading>
      <Box h="30rem">
        <NakshaMapboxList
          viewPort={mapCenter}
          loadToC={false}
          lang={lang}
          key={JSON.stringify(filter)}
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          nakshaApiEndpoint={ENDPOINT.NAKSHA}
          geoserver={{
            endpoint: ENDPOINT.GEOSERVER,
            store: SITE_CONFIG.GEOSERVER.STORE,
            workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
          }}
          selectedLayers={geoserverLayers}
          layers={[
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
          ]}
        />
      </Box>
    </Box>
  );
}
