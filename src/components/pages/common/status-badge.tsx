import { Badge, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { TAXON_BADGE_COLORS } from "@static/constants";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface TaxonStatusBadgeProps {
  reco;
  taxonId;
  crumbs;
}

function TaxonStatusBadge({ reco, taxonId, crumbs }: TaxonStatusBadgeProps) {
  const { t } = useTranslation();

  const taxonLink = `/taxonomy/list`;

  switch (reco?.status) {
    case "ACCEPTED":
      return (
        <LocalLink href={taxonLink} params={{ taxonId: taxonId, showTaxon: taxonId }}>
          <Link>
            <Badge colorPalette={TAXON_BADGE_COLORS.ACCEPTED}>{t("common:accepted")}</Badge>
          </Link>
        </LocalLink>
      );

    case "SYNONYM":
      const [lastCrumb] = crumbs?.slice(-1) || [{ name: null }];
      return (
        <LocalLink href={taxonLink}>
          <Link>
            <Badge colorPalette={TAXON_BADGE_COLORS.SYNONYM}>
              {t("observation:synonym")}
              {lastCrumb?.name && `: ${lastCrumb.name}`}
            </Badge>
          </Link>
        </LocalLink>
      );

    default:
      return !reco?.scientificName ? (
        <span>
          <Badge colorPalette="red">{t("observation:help_identify")}</Badge>
        </span>
      ) : null;
  }
}

export default TaxonStatusBadge;
