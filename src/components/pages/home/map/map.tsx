import { Box } from "@chakra-ui/react";
import useOccurrenceMapStyles from "@components/pages/common/occurrence-map/basemap";
import {
  DensityLegend,
  OccurrenceSourceMenu,
  OccurrenceTotalsPanel
} from "@components/pages/common/occurrence-map/overlays";
import useOccurrenceGrid from "@components/pages/common/occurrence-map/use-occurrence-grid";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT, mapStyles } from "@static/constants";
import { hasAccess } from "@utils/auth";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";

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

/** Layers shown at first: observations and geoserver layers from the site config */
const geoserverLayers: string[] = SITE_CONFIG.HOME.MAP || [];

const OBSERVATIONS_LAYER_ID = "global-observations";

/** Overlay offsets that clear naksha's 40px layers and info buttons, 16px from the corners */
const OVERLAY_TOP = "20px";
const OVERLAY_SIDE = "64px";

export default function Map() {
  /**
   * Do not remove `undefined` from `userGroupId`
   * so key will be automatically removed if `null`
   */
  const { currentGroup, isLoggedIn } = useGlobalState();
  const userGroupId = currentGroup?.id || undefined;
  const mapCenter = useMemo(() => getMapCenter(3.5), []);
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

  // GBIF records can't be filtered by user group, so only the main portal adds them, in place
  // of its observations layer
  const withSources = !userGroupId && geoserverLayers.includes(OBSERVATIONS_LAYER_ID);
  const occurrenceGrid = useOccurrenceGrid(undefined, fetchGridData);
  const occurrenceMapStyles = useOccurrenceMapStyles(withSources);

  // naksha resets its layer selection whenever this array changes, which would drop layers
  // turned on in the layers panel, so it only changes with the source
  const occurrenceLayerId = occurrenceGrid.selectedLayers[0];
  const selectedLayers = useMemo(
    () =>
      withSources
        ? geoserverLayers.map((id) => (id === OBSERVATIONS_LAYER_ID ? occurrenceLayerId : id))
        : geoserverLayers,
    [withSources, occurrenceLayerId]
  );

  if (withSources) {
    return (
      <Box position="relative" h="100%">
        <OccurrenceSourceMenu
          value={occurrenceGrid.source}
          onChange={occurrenceGrid.setSource}
          top={OVERLAY_TOP}
          left={OVERLAY_SIDE}
        />
        <OccurrenceTotalsPanel
          totals={occurrenceGrid.totals}
          top={OVERLAY_TOP}
          right={OVERLAY_SIDE}
        />
        <DensityLegend />
        {occurrenceMapStyles && (
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
            showScaleControl={true}
            showResetControl={true}
            collapseAttribution={true}
            selectedLayers={selectedLayers}
            mapStyles={occurrenceMapStyles}
            layers={occurrenceGrid.layers}
          />
        )}
      </Box>
    );
  }

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
          id: OBSERVATIONS_LAYER_ID,
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
