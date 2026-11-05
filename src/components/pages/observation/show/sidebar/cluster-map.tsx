import { Box } from "@chakra-ui/react";
import OccurrenceSourceMenu, {
  getOccurrenceGridFetchers,
  getOccurrenceLayerId,
  OCCURRENCE_SOURCES
} from "@components/pages/common/occurrence-source-menu";
import { axGetObservationMapData } from "@services/observation.service";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import { useMemo, useState } from "react";
import LazyLoad from "react-lazyload";

import { mapStyles } from "@/static/constants";

const NakshaMaplibreLayers: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreLayers),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

// TODO: observation map on click component
const onObservationGridClick = () => <Box maxH="250px" overflow="auto" fontSize="sm"></Box>;

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
  /** adds the All/IBP/GBIF source dropdown; needs `filter.taxon` */
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

  const gridLayer = {
    onHover: onObservationGridHover,
    onClick: onObservationGridClick,
    data: {
      index: "extended_observation",
      type: "extended_records",
      geoField: "location",
      summaryColumn: ["count"],
      propertyMap: { count: "Count" }
    }
  };

  // GBIF occurrences are matched to IBP taxa, so the sources need a taxon
  const withSources = showGBIF && !!filter?.taxon;
  const [source, setSource] = useState("all");
  const gridFetchers = getOccurrenceGridFetchers(filter?.taxon, fetchGridData);

  return (
    <Box
      h="422px"
      borderRadius={borderRadius}
      overflow="hidden"
      className="gray-box"
      display="block"
      position="relative"
    >
      {withSources && <OccurrenceSourceMenu value={source} onChange={setSource} />}
      <LazyLoad height={422} once={true}>
        <NakshaMaplibreLayers
          defaultViewState={defaultViewState}
          key={k}
          lang={lang}
          selectedLayers={
            !filter ? [] : withSources ? [getOccurrenceLayerId(source)] : ["species-observations"]
          }
          showFullscreenControl={true}
          mapStyles={mapStyles}
          layers={
            withSources
              ? OCCURRENCE_SOURCES.map(({ value, label }) => ({
                  ...gridLayer,
                  id: getOccurrenceLayerId(value),
                  title: `${label} Occurrences`,
                  source: { type: "grid", fetcher: gridFetchers[value] }
                }))
              : [
                  {
                    ...gridLayer,
                    id: "species-observations",
                    title: "Species Observations",
                    source: { type: "grid", fetcher: fetchGridData }
                  }
                ]
          }
          markers={latitude ? [{ latitude, longitude, colorHex }] : []}
        />
      </LazyLoad>
    </Box>
  );
}
