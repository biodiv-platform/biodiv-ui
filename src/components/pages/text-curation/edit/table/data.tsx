import ExternalBlueLink from "@components/@core/blue-link/external";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import CurationStatus from "./curation-status";

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
    name: "curatedSName",
    selector: (row) => row.curatedSName
  },
  {
    name: "curatedLocation",
    selector: (row) => row.curatedLocation
  },
  {
    name: "curatedDate",
    selector: (row) => row.curatedDate
  }
];

export const editColumn = {
  name: "curatedStatus",
  selector: (row) => row.curatedStatus,
  cell: (row) => <CurationStatus row={row} name="curatedStatus" />
};
