import { AssetStatus } from "@interfaces/custom";
import { EXIF_GPS_FOUND, FORM_DATEPICKER_CHANGE } from "@static/events";
import { DEFAULT_LICENSE } from "@static/licenses";
import { LOCAL_ASSET_PREFIX } from "@static/observation-create";
import loadImage from "blueimp-load-image";
import { parse } from "exifr/dist/lite.umd";
import { nanoid } from "nanoid";
import { emit } from "react-gbus";

function resizeImage(file: File, max = 3000) {
  return new Promise((resolve) => {
    loadImage(
      file,
      (img, data) => {
        try {
          if (data?.exif) {
            // fix orientation
            if (data.exif[274]) {
              loadImage.writeExifData(data.imageHead, data, "Orientation", 1);
            }

            // replace imageHead to restore exif of original image
            img.toBlob((blob) => {
              loadImage.replaceHead(blob, data.imageHead, resolve);
            }, file.type);
          } else {
            img.toBlob(resolve);
          }
        } catch (e) {
          console.error(e);
          img.toBlob(resolve);
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
}

async function parseGPS(file: File) {
  try {
    return await parse(file);
  } catch (e) {
    console.error(e);
    return {};
  }
}

export function resizeMultiple(files: File[]) {
  return Promise.all(
    files.map(async (file) => {
      try {
        let meta = {};
        if (file.type.startsWith("image")) {
          const [blob, exif]: any = await Promise.all([resizeImage(file), parseGPS(file)]);
          console.debug("EXIF", exif);
          if (exif?.DateTimeOriginal) {
            emit(FORM_DATEPICKER_CHANGE + "observedOn", exif?.DateTimeOriginal);
          }
          if (exif?.latitude && exif?.longitude) {
            emit(EXIF_GPS_FOUND, { lat: exif.latitude, lng: exif.longitude });
          }
          meta = {
            blob,
            latitude: exif?.latitude,
            longitude: exif?.longitude,
            dateCreated: exif?.DateTimeOriginal
          };
        } else if (file.type.startsWith("video") || file.type.startsWith("audio")) {
          meta = { blob: file };
        }
        const hashKey = `${LOCAL_ASSET_PREFIX}${nanoid()}`;
        return {
          ...meta,
          hashKey,
          fileName: file.name,
          url: null,
          path: `/${hashKey}/${file.name}`,
          type: file.type,
          licenceId: DEFAULT_LICENSE,
          status: AssetStatus.Pending,
          dateUploaded: new Date().getTime(),
          caption: "",
          rating: 0,
          isUsed: 0
        };
      } catch (e) {
        console.error(e);
        return {};
      }
    })
  );
}
