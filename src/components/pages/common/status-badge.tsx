import { Badge, Link } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import { TAXON_BADGE_COLORS } from "@static/constants";
import React from "react";

interface TaxonStatusBadgeProps {
  reco;
  taxonId;
  crumbs;
}

function TaxonStatusBadge({ reco, taxonId, crumbs }: TaxonStatusBadgeProps) {
  const { t } = useTranslation();

  const taxonLink = `/namelist/index?taxon=${taxonId}`;

  switch (reco?.status) {
    case "ACCEPTED":
      return (
        <Link href={taxonLink}>
          <Badge colorScheme={TAXON_BADGE_COLORS.ACCEPTED}>{t("OBSERVATION.ACCEPTED")}</Badge>
        </Link>
      );

    case "SYNONYM":
      const [lastCrumb] = crumbs?.slice(-1) || [{ name: null }];
      return (
        <Link href={taxonLink}>
          <Badge colorScheme={TAXON_BADGE_COLORS.SYNONYM}>
            {t("OBSERVATION.SYNONYM")}
            {lastCrumb.name && `: ${lastCrumb.name}`}
          </Badge>
        </Link>
      );

    default:
      return !reco?.scientificName ? (
        <span>
          <Badge colorScheme="red">{t("OBSERVATION.HELP_IDENTIFY")}</Badge>
        </span>
      ) : null;
  }
}

export default TaxonStatusBadge;
