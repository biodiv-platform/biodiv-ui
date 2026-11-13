import { mapStyles } from "@static/constants";
import { useEffect, useState } from "react";

/**
 * OpenFreeMap basemap for the occurrence maps. Styles: positron (light), fiord (dark),
 * bright, liberty; the India boundary fix below works for any of them.
 */
const BASEMAP = { name: "Fiord", url: "https://tiles.openfreemap.org/styles/fiord" };

/**
 * OpenStreetMap India community border lines, the same file the India OSM basemap uses:
 * India's claimed border (`claimed_by: IN`) and borders India disputes (`disputed_by: IN`)
 */
const INDIA_BOUNDARY_URL =
  "https://raw.githubusercontent.com/osm-in/mapbox-gl-styles/master/data/osm-india-adm0-disputed-lines.geojson";

const INDIA_BOUNDARY_SOURCE = "india-boundary";

const isBoundaryLayer = (layer) => layer["source-layer"] === "boundary";

/** Layer that only draws disputed borders (Positron's boundary_disputed) */
const isDisputedBoundaryLayer = (layer) =>
  isBoundaryLayer(layer) &&
  JSON.stringify(layer.filter || []).includes('["==",["get","disputed"],1]');

/** Country border layer (admin_level 2), whose look India's border copies */
const isCountryBoundaryLayer = (layer) =>
  isBoundaryLayer(layer) &&
  JSON.stringify(layer.filter || []).includes('["==",["get","admin_level"],2]');

const NOT_DISPUTED = ["!=", ["get", "disputed"], 1];

/** Keeps disputed borders out of a border layer that draws them along with the rest (e.g. Fiord) */
const withoutDisputed = (layer) =>
  isBoundaryLayer(layer) && (!layer.filter || JSON.stringify(layer.filter).includes('["get",')) // expression filters only
    ? { ...layer, filter: layer.filter ? ["all", layer.filter, NOT_DISPUTED] : NOT_DISPUTED }
    : layer;

/**
 * OpenFreeMap style with India's boundaries: drops disputed borders, covers borders India
 * disputes with the background colour and draws India's claimed border like any other country border
 */
const toIndiaStyle = (style) => {
  const countryBorder = style.layers.find(isCountryBoundaryLayer);
  const background =
    style.layers.find((layer) => layer.type === "background")?.paint?.["background-color"] ||
    "rgb(242,243,240)";

  const layers = style.layers
    .filter((layer) => !isDisputedBoundaryLayer(layer))
    .map(withoutDisputed);
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

/** naksha map styles for the occurrence maps, loaded once; the India OSM basemap if BASEMAP fails */
const loadOccurrenceMapStyles = () => {
  occurrenceMapStyles ??= fetch(BASEMAP.url)
    .then((response) => {
      if (!response.ok) throw new Error(`${BASEMAP.name} style: HTTP ${response.status}`);
      return response.json();
    })
    .then((style) => [{ text: BASEMAP.name, key: "0", style: toIndiaStyle(style) }])
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
