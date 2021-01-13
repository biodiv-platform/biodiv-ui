import fs from "fs";
import os from "os";
import { promisify } from "util";

import { name, version } from "../../package.json";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export const pathPrefix = `${os.tmpdir()}/${name}--${version}--`;

/**
 * read file from disk
 *
 * @warning SERVER SIDE ONLY
 * @param {*} file
 */
export const readCache = async (file) => {
  try {
    const data = await readFile(pathPrefix + file, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.debug(`DISK_READ_FAILURE: ${file}`);
  }
};

/**
 * write file to disk
 *
 * @warning SERVER SIDE ONLY
 * @param {*} file
 */
export const writeCache = async (file, data) => {
  try {
    await writeFile(pathPrefix + file, JSON.stringify(data));
  } catch (e) {
    console.debug(`DISK_WRITE_FAILURE: ${file}`);
  }
};
