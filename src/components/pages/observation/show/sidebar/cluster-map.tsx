import { Box } from "@chakra-ui/react";
import {
  DensityLegend,
  OccurrenceSourceMenu,
  OccurrenceTotalsPanel
} from "@components/pages/common/occurrence-map/overlays";
import useOccurrenceMapStyles from "@components/pages/common/occurrence-map/basemap";
import useOccurrenceGrid from "@components/pages/common/occurrence-map/use-occurrence-grid";
import { axGetObservationMapData } from "@services/observation.service";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import LazyLoad from "react-lazyload";

import { mapStyles } from "@/static/constants";

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

interface ClusterMapProps {
  filter;
  latitude?;
  longitude?;
  k?;
  colorHex?;
  borderRadius?;
  /** adds IBP/GBIF sources: dropdown, totals, density legend; needs `filter.taxon` */
  showGBIF?: boolean;
}

export default function ClusterMap({
  filter,
  latitude,
  longitude,
  k,
  colorHex = "E53E3E",
  borderRadius = "md",
  showGBIF = false
}: ClusterMapProps) {
  const { lang } = useTranslation();
  const defaultViewState = useMemo(
    () => getMapCenter(3.1, latitude ? { latitude, longitude } : {}),
    []
  );

  const fetchGridData = async (geoProps) => {
    const params = {
      ...geoProps,
      ...filter,
      view: "map",
      geoField: "location"
    };

    const { data } = await axGetObservationMapData(params);
    return data;
  };

  // GBIF occurrences are matched to IBP taxa, so the sources need a taxon
  const withSources = showGBIF && !!filter?.taxon;
  const occurrenceGrid = useOccurrenceGrid(filter?.taxon, fetchGridData);
  const occurrenceMapStyles = useOccurrenceMapStyles(withSources);
  const basemapStyles = withSources ? occurrenceMapStyles : mapStyles;

  return (
    <Box
      h="422px"
      borderRadius={borderRadius}
      overflow="hidden"
      className="gray-box"
      display="block"
      position="relative"
    >
      {withSources && (
        <>
          <OccurrenceSourceMenu value={occurrenceGrid.source} onChange={occurrenceGrid.setSource} />
          <OccurrenceTotalsPanel totals={occurrenceGrid.totals} />
          <DensityLegend />
        </>
      )}
      <LazyLoad height={422} once={true}>
        {basemapStyles && (
          <NakshaMaplibreLayers
            defaultViewState={defaultViewState}
            key={k}
            lang={lang}
            selectedLayers={
              !filter ? [] : withSources ? occurrenceGrid.selectedLayers : ["species-observations"]
            }
            showFullscreenControl={true}
            showScaleControl={withSources}
            showResetControl={withSources}
            mapStyles={basemapStyles}
            layers={
              withSources
                ? occurrenceGrid.layers
                : [
                    {
                      id: "species-observations",
                      title: "Species Observations",
                      source: { type: "grid", fetcher: fetchGridData },
                      onHover: onObservationGridHover,
                      data: {
                        index: "extended_observation",
                        type: "extended_records",
                        geoField: "location",
                        summaryColumn: ["count"],
                        propertyMap: { count: "Count" }
                      }
                    }
                  ]
            }
            markers={latitude ? [{ latitude, longitude, colorHex }] : []}
          />
        )}
      </LazyLoad>
    </Box>
  );
}
