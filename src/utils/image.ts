import SITE_CONFIG from "@configs/site-config";
import { AssetStatus } from "@interfaces/custom";
import { EXIF_GPS_FOUND, FORM_DATEPICKER_CHANGE } from "@static/events";
import { ACCEPTED_FILE_TYPES, LOCAL_ASSET_PREFIX } from "@static/observation-create";
import notification from "@utils/notification";
import loadImage from "blueimp-load-image";
import { nanoid } from "nanoid";
import { emit } from "react-gbus";

import { normalizeFileName } from "./basic";
import { CleanExif } from "./location";
import { getBlockHash } from "./phash";

export async function resizeImage(file: File, max = 3000): Promise<any> {
  try {
    const blockHash = await getBlockHash(file);

    const response = await new Promise((resolve) => {
      loadImage(
        file,
        (img, data) => {
          if (data?.exif) {
            // fix orientation
            if (data.exif[274]) {
              loadImage.writeExifData(data.imageHead, data, "Orientation", 1);
            }

            // replace imageHead to restore exif of original image
            img.toBlob((blob) => {
              loadImage.replaceHead(blob, data.imageHead, (d) =>
                resolve([d, CleanExif(data?.exif, blockHash)])
              );
            }, file.type);
          } else {
            img.toBlob((d) => resolve([d, { blockHash }]));
          }
        },
        {
          meta: true,
          canvas: true,
          orientation: true,
          maxWidth: max,
          maxHeight: max
        }
      );
    });

    return response;
  } catch (e) {
    const resourceTypeFileFormat = "." + file.name.substring(file.type.indexOf(".") + 1);

    if (!ACCEPTED_FILE_TYPES["image/*"].includes(resourceTypeFileFormat)) {
      console.warn(resourceTypeFileFormat + " format not supported ");
      notification(resourceTypeFileFormat + " format not supported ");
    } else {
      console.warn("EXIF Failed", e);
      notification("Outdated/Unsupported Browser");
    }
  }

  return [file, {}];
}

export async function resizePredictImage(file: File): Promise<any> {
  try {
    const response = await new Promise((resolve) => {
      loadImage(file, (image) => resolve(image.toDataURL()), {
        maxWidth: 200,
        meta: true,
        orientation: true,
        canvas: true
      });
    });

    return response;
  } catch (e) {
    console.warn("Resize Failed", e);
    notification("Outdated/Unsupported Browser");
  }

  return undefined;
}

export const getAssetObject = (file, meta?) => {
  const hashKey = `${LOCAL_ASSET_PREFIX}${nanoid()}`;
  const finalMeta = meta || { blob: file };
  const fileName = normalizeFileName(file.name);

  return {
    ...finalMeta,
    hashKey,
    fileName,
    url: null,
    path: `/${hashKey}/${fileName}`,
    type: file.type,
    licenseId: SITE_CONFIG.LICENSE.DEFAULT,
    status: AssetStatus.Pending,
    dateUploaded: new Date().getTime(),
    caption: "",
    rating: 0,
    isUsed: 0,
    languageId: SITE_CONFIG.LANG.DEFAULT_ID
  };
};

export const resizeMultiple = async (files: File[]) => {
  const assets: any[] = [];

  const SUPPORTED_FORMATS = [
    ...ACCEPTED_FILE_TYPES["image/*"],
    ...ACCEPTED_FILE_TYPES["audio/*"],
    ...ACCEPTED_FILE_TYPES["video/*"],
    ...ACCEPTED_FILE_TYPES["application/zip"]
  ];

  for (const file of files) {
    const resourceTypeFileFormat = "." + file.name.substring(file.name.indexOf(".") + 1);

    try {
      let meta;

      if (file.type.startsWith("image") && SUPPORTED_FORMATS.includes(resourceTypeFileFormat)) {
        const [blob, exif] = await resizeImage(file);

        if (exif?.dateCreated) {
          emit(FORM_DATEPICKER_CHANGE + "observedOn", exif?.dateCreated);
        }

        if (exif?.latitude) {
          emit(EXIF_GPS_FOUND, { lat: exif.latitude, lng: exif.longitude });
        }

        meta = {
          blob,
          ...exif
        };
      }

      if (SUPPORTED_FORMATS.includes(resourceTypeFileFormat)) {
        assets.push(getAssetObject(file, meta));
      } else {
        notification(resourceTypeFileFormat + " format not supported");
      }
    } catch (e) {
      console.error(e);
      assets.push({});
    }
  }

  return assets;
};
