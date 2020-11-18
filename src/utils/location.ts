import SITE_CONFIG from "@configs/site-config.json";
import { isBrowser } from "@static/constants";
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
  if (!costr) {
    return [];
  }

  const coarr = costr.split(",");
  const coordinates = [];
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
};

export const getMapCenter = (zoomDiff, maxZoom?) => ({
  ...SITE_CONFIG.MAP.CENTER,
  bearing: 0,
  pitch: 0,
  zoom: SITE_CONFIG.MAP.CENTER.zoom + (zoomDiff || 0),
  maxZoom
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

export const CleanExif = (data) => {
  if (!data) return {};

  const exif = data.getAll();

  return {
    latitude: ConvertDMSToDD(exif?.GPSInfo?.GPSLatitude, exif?.GPSInfo?.GPSLatitudeRef),
    longitude: ConvertDMSToDD(exif?.GPSInfo?.GPSLongitude, exif?.GPSInfo?.GPSLongitudeRef),
    dateCreated: parseEXIF(exif?.Exif?.DateTimeOriginal)
  };
};
