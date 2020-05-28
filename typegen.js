#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

"use strict";

const fs = require("fs");
const axios = require("axios");
const { execSync } = require("child_process");

const endpoint = "venus.strandls.com";
const outputPath = "src/interfaces/";
const microservices = [
  "naksha",
  "user",
  "esmodule",
  "activity",
  "observation",
  "files",
  "utility",
  "userGroup",
  "traits"
];

const dtsgen = (ms) => {
  const dtsFilePath = `${outputPath}${ms}.ts`;
  try {
    fs.unlinkSync(dtsFilePath);
  } catch (e) {
    console.debug(`✨ New: ${ms}`);
  }
  execSync(`npx dtsgenerator --out ${dtsFilePath} ${ms}.json -n ""`, { stdio: "inherit" });
  execSync(`prettier --write ${dtsFilePath}`, { stdio: "inherit" });
  execSync(`sed -i 's|: {}|: Record<string, unknown>|g' ${dtsFilePath}`);
};

const main = async (ms) => {
  try {
    const { data } = await axios.get(`https://${endpoint}/${ms}-api/api/swagger.json`);
    console.debug(`⬇️ Downloaded ${ms}`);

    const { paths, ...swagger } = data;
    fs.writeFileSync(`${ms}.json`, JSON.stringify(swagger, null, 2));
    await dtsgen(ms);

    fs.unlinkSync(`${ms}.json`);
    console.debug(`✔️ Generated ${ms}`);
  } catch (e) {
    console.error(e);
  }
};

Promise.all(microservices.map(main));
