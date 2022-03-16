import { openDbf, openShp } from "shapefile";

import { LAYER_TYPES } from "../data";

export const parseSHP = (file, update) => {
  const readerShp = new FileReader();
  readerShp.onload = async () => {
    const sourceShp = await openShp(readerShp.result);
    const meta = (await sourceShp.read()).value;
    update("shp", file, {
      ...meta,

      // if unknown types are identified it will fallback to manual selection
      type: LAYER_TYPES.includes(meta.type.toUpperCase()) ? meta.type : undefined
    });
  };
  readerShp.readAsArrayBuffer(file);
};

export const parseDBF = (file, update) => {
  const readerDbf = new FileReader();
  readerDbf.onload = async () => {
    const sourceDbf = await openDbf(readerDbf.result, { encoding: "UTF-8" });

    const rows: any[] = [];
    try {
      for (let i = 0; i < 5; i++) {
        rows.push((await sourceDbf.read()).value);
      }
    } catch (e) {
      console.error(e);
    }

    const keys = Object.keys(rows[0]);
    const headings = Object.keys(rows[0]);

    update("dbf", file, {
      keys,
      headings,
      rows
    });
  };
  readerDbf.readAsArrayBuffer(file);
};

export const parseDefault = (file: File, update) => {
  const extension = file.name.split(".").pop();
  update(extension, file, {});
};
