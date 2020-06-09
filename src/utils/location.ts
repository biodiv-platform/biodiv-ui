import { isBrowser } from "@static/constants";

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
  if (!costr || costr == null) {
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
      properties: { shape: "Rectangle" },
      geometry: {
        type: "Polygon",
        coordinates: [coordinates]
      }
    }
  ];
};
