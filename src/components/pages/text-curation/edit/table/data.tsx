import ExternalBlueLink from "@components/@core/blue-link/external";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import ActionButton from "./action-button";
import CurationStatus from "./curation-status";

export const DATE_FORMAT = {
  DAY: "d-m-Y",
  MONTH: "m-Y",
  YEAR: "Y"
};

export const CURATED_STATUS = {
  PENDING: 0,
  CURATED: 1,
  REJECTED: 2
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
    selector: (row) => row.curatedSName,
    cell: (row) => <ActionButton row={row} name="curatedSName" />
  },
  {
    name: "curatedLocation",
    selector: (row) => row.curatedLocation,
    cell: (row) => <ActionButton row={row} name="curatedLocation" />
  },
  {
    name: "curatedDate",
    selector: (row) => row.curatedDate,
    cell: (row) => <ActionButton row={row} name="curatedDate" />
  },
  {
    name: "curatedStatus",
    selector: (row) => row.curatedStatus,
    cell: (row) => <CurationStatus row={row} name="curatedStatus" />
  }
];
