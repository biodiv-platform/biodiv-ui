import distance from "@turf/distance";
import { point } from "@turf/helpers";
import setClustering from "set-clustering";

import dayjs from "./date";
import { comparePerceptualHash } from "./phash";

export const areImagesSimilar = (image1, image2) => {
  if (
    image1.dateCreated &&
    image2.dateCreated &&
    Math.abs(dayjs(image1.dateCreated).diff(dayjs(image2.dateCreated), "seconds")) < 31
  ) {
    return 1;
  }

  if (
    image1.longitude &&
    image2.longitude &&
    distance(
      point([image1.longitude, image1.latitude]),
      point([image2.longitude, image2.latitude]),
      { units: "meters" }
    ) < 1
  ) {
    return 1;
  }

  if (
    !image1.dateCreated &&
    !image1.longitude &&
    Math.abs(comparePerceptualHash(image1.blockHash, image2.blockHash)) > 0.7
  ) {
    return 1;
  }

  return 0;
};

export const clusterResources = (resources) => {
  const cluster = setClustering(resources, areImagesSimilar);
  return cluster.similarGroups(0.5);
};
