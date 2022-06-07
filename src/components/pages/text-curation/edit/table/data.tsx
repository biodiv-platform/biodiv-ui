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
  REJECTED_OTHER_COMMUNICATION: "REJECTED_OTHER_COMMUNICATION",
  REJECTED_NOT_ACCESSIBLE: "REJECTED_NOT_ACCESSIBLE",
  REJECTED_OTHER_ORGANISM: "REJECTED_OTHER_ORGANISM",
  REJECTED_INCOMPLETE:"REJECTED_INCOMPLETE"
};

export const columns = [
  {
    name: "id",
    selector: (row) => row.id
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
    selector: (row) => row.curatedDate,
    cell: (row) => {
      const date = row.curatedDate;
      let formatedDate = row.curatedDate;
      if (row.curatedDateFormat == "MONTH" && date != "") {
        formatedDate = date.substring(date.indexOf("-") + 1, date.length);
      } else if (row.curatedDateFormat == "YEAR" && date != "") {
        formatedDate = date.substring(date.lastIndexOf("-") + 1, date.length);
      } else {
        formatedDate = date;
      }
      return formatedDate;
    }
  },
  {
    name: "Curated Status",
    selector: (row) => row.curatedStatus
  }
];
