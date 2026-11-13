import { mapStyles } from "@static/constants";
import { useEffect, useState } from "react";

/** OpenFreeMap Positron, a light background that lets the density grid stand out */
const POSITRON_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/**
 * OpenStreetMap India community border lines, the same file the India OSM basemap uses:
 * India's claimed border (`claimed_by: IN`) and borders India disputes (`disputed_by: IN`)
 */
const INDIA_BOUNDARY_URL =
  "https://raw.githubusercontent.com/osm-in/mapbox-gl-styles/master/data/osm-india-adm0-disputed-lines.geojson";

const INDIA_BOUNDARY_SOURCE = "india-boundary";

/** Positron layer that draws disputed borders; matched by filter too in case the id changes */
const isDisputedBoundaryLayer = (layer) =>
  layer.id === "boundary_disputed" ||
  (layer["source-layer"] === "boundary" &&
    JSON.stringify(layer.filter || []).includes('["==",["get","disputed"],1]'));

/**
 * Positron with India's boundaries: drops the disputed borders, covers borders India disputes
 * with the background colour and draws India's claimed border like any other country border
 */
const toIndiaStyle = (style) => {
  const countryBorder = style.layers.find((layer) => layer.id === "boundary_2");
  const background =
    style.layers.find((layer) => layer.type === "background")?.paint?.["background-color"] ||
    "rgb(242,243,240)";

  const layers = style.layers.filter((layer) => !isDisputedBoundaryLayer(layer));
  // India's lines go right after the map's own borders, below the labels
  const lastBoundaryIndex = layers.reduce(
    (last, layer, index) => (layer["source-layer"] === "boundary" ? index : last),
    layers.length - 1
  );

  layers.splice(
    lastBoundaryIndex + 1,
    0,
    {
      id: "boundary-disputed-by-india",
      type: "line",
      source: INDIA_BOUNDARY_SOURCE,
      filter: ["==", ["get", "disputed_by"], "IN"],
      paint: {
        "line-color": background,
        "line-width": ["interpolate", ["linear"], ["zoom"], 3, 2, 5, 3, 12, 6]
      }
    },
    {
      id: "boundary-claimed-by-india",
      type: "line",
      source: INDIA_BOUNDARY_SOURCE,
      filter: ["==", ["get", "claimed_by"], "IN"],
      paint: countryBorder?.paint || { "line-color": "hsl(0,0%,70%)", "line-width": 1.2 }
    }
  );

  return {
    ...style,
    sources: {
      ...style.sources,
      [INDIA_BOUNDARY_SOURCE]: { type: "geojson", data: INDIA_BOUNDARY_URL }
    },
    layers
  };
};

let occurrenceMapStyles: Promise<any[]> | undefined;

/** naksha map styles for the occurrence maps, loaded once; the India OSM basemap if Positron fails */
const loadOccurrenceMapStyles = () => {
  occurrenceMapStyles ??= fetch(POSITRON_STYLE_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`Positron style: HTTP ${response.status}`);
      return response.json();
    })
    .then((style) => [{ text: "Positron", key: "0", style: toIndiaStyle(style) }])
    .catch((error) => {
      console.error(error);
      return mapStyles;
    });
  return occurrenceMapStyles;
};

/**
 * Map styles for an occurrence map; undefined until loaded, so the map waits for its basemap
 *
 * @param enabled false skips loading, for maps that keep the default basemap
 */
export default function useOccurrenceMapStyles(enabled = true) {
  const [styles, setStyles] = useState<any[]>();

  useEffect(() => {
    if (enabled) loadOccurrenceMapStyles().then(setStyles);
  }, [enabled]);

  return styles;
}
