import ExternalBlueLink from "@components/@core/blue-link/external";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export const DATE_FORMAT = {
  DAY: "d-m-Y",
  MONTH: "m-Y",
  YEAR: "Y"
};

export const DATE_FORMAT_OPTIONS = Object.keys(DATE_FORMAT).map((df) => ({ label: df, value: df }));

export const CURATED_STATUS = {
  PENDING: "PENDING",
  CURATED: "CURATED",
  REJECTED: "REJECTED"
};

export const columns = [
  {
    name: "uniqueId",
    selector: (row) => row.uniqueId
  },
  {
    name: "permalink",
    selector: (row) => row.permalink,
    cell: (row) => {
      const { t } = useTranslation();
      const pl = row.permalink || row.Permalink;

      return pl ? (
        <ExternalBlueLink href={pl}>{t("observation:sync.view")}</ExternalBlueLink>
      ) : null;
    }
  },
  {
    name: "Curated Scientific Name",
    selector: (row) => row.curatedSName
  },
  {
    name: "Curated Location",
    selector: (row) => row.curatedLocation
  },
  {
    name: "Curated Date",
    selector: (row) => row.curatedDate
  },
  {
    name: "Curated Status",
    selector: (row) => row.curatedStatus
  }
];
