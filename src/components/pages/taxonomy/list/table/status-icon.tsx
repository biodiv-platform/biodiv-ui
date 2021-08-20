import CircleIcon from "@icons/circle";
import EqualsIcon from "@icons/equals";
import { TAXON_STATUS_VALUES } from "@static/taxon";
import React from "react";

/**
 * Shows _circle_ and _equals_ icons on taxon table
 *
 * @export
 * @param {*} { status }
 * @return {*}
 */
export default function StatusIcon({ status }) {
  switch (status) {
    case TAXON_STATUS_VALUES.ACCEPTED:
      return <CircleIcon mr={1} />;

    case TAXON_STATUS_VALUES.SYNONYM:
      return <EqualsIcon mr={1} ml={4} />;

    default:
      return null;
  }
}
