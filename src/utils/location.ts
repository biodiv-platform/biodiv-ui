import SITE_CONFIG from "@configs/site-config";
import { isBrowser } from "@static/constants";
import { bbox, bboxPolygon, buffer } from "@turf/turf";

// import * as turf from "@turf/turf";
import { parseEXIF } from "./date";

/**
 * This function is designed to use existing pre-initialized
 * google maps instance and perform reverse geocode
 *
 * @export
 * @param {*} location
 */
export function reverseGeocode(location) {
  return new Promise<any[]>((resolve, reject) => {
    if (isBrowser) {
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ location }, function (results, status) {
        if (status === "OK" && results.length > 0) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    } else {
      reject();
    }
  });
}

/**
 * Converts flat coordinates from query param (string) to feature object
 *
 * @param {*} costr
 * @returns
 */
export const stringToFeature = (costr) => {
  try {
    const coarr = costr.split(",");
    const coordinates: any = [];
    for (let i = 0; i < coarr.length; i += 2) {
      coordinates.push([Number(coarr[i]), Number(coarr[i + 1])]);
    }
    return [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [coordinates]
        }
      }
    ];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMapCenter = (zoomDiff, extra = {}) => ({
  ...SITE_CONFIG.MAP.CENTER,
  bearing: 0,
  pitch: 0,
  zoom: SITE_CONFIG.MAP.CENTER.zoom + (zoomDiff || 0),
  ...extra
});

const ConvertDMSToDD = (dms, direction) => {
  try {
    const [degrees, minutes, seconds] = dms.split(",");

    const m1 = Number(minutes) / 60;
    const s1 = Number(seconds) / (60 * 60);
    const d1 = Number(degrees);

    let dd = d1 + m1 + s1;

    if (direction === "S" || direction === "W") dd *= -1;

    return Number(dd.toFixed(4));
  } catch (e) {
    console.warn("Unable to parse GPS");
  }
};

export const CleanExif = (data, blockHash) => {
  if (!data) return {};

  const exif = data.getAll();

  return {
    latitude: ConvertDMSToDD(exif?.GPSInfo?.GPSLatitude, exif?.GPSInfo?.GPSLatitudeRef),
    longitude: ConvertDMSToDD(exif?.GPSInfo?.GPSLongitude, exif?.GPSInfo?.GPSLongitudeRef),
    dateCreated: parseEXIF(exif?.Exif?.DateTimeOriginal),
    blockHash
  };
};

/**
 * Convert Point or LineString into a polygon string format
 * expected by the observation filters:
 * - Point → 5 km buffer (circle polygon)
 * - LineString → bounding box → 5 km buffer
 *
 * @param feature GeoJSON feature
 * @returns Comma-separated coordinate string OR null
 */
export function convertFeatureToPolygonString(feature: any): string | null {
  if (!feature?.geometry) return null;

  let processed = feature;

  if (feature.geometry.type === "Point") {
    // Point → 5 km circle buffer
    processed = buffer(feature, 5, { units: "kilometers" });
  }

  if (feature.geometry.type === "LineString") {
    // LineString → bounding box → 5 km buffer
    const box = bbox(feature);
    const rectangle = bboxPolygon(box);
    processed = buffer(rectangle, 5, { units: "kilometers" });
  }

  if (processed.geometry.type === "Polygon") {
    const coords = processed.geometry.coordinates[0]; // outer ring
    // ensure polygon is closed
    const closedCoords =
      coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]
        ? [...coords, coords[0]]
        : coords;

    return closedCoords.map((c) => c.join(",")).join(",");
  }

  return null;
}
