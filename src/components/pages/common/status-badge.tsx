import { Badge } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { TAXON_BADGE_COLORS } from "@static/constants";
import useTranslation from "next-translate/useTranslation";

interface TaxonStatusBadgeProps {
  reco;
  taxonId;
  crumbs;
  name;
}

function TaxonStatusBadge({ reco, taxonId, crumbs, name }: TaxonStatusBadgeProps) {
  const { t } = useTranslation();

  const taxonLink = `/taxonomy/list`;

  switch (reco?.status) {
    case "ACCEPTED":
      return (
        <LocalLink href={taxonLink} params={{ taxonId: taxonId, showTaxon: taxonId }}>
          <Badge colorPalette={TAXON_BADGE_COLORS.ACCEPTED}>{t("common:accepted")}</Badge>
        </LocalLink>
      );

    case "SYNONYM":
      const [lastCrumb] = crumbs?.slice(-1) || [{ name: null }];
      return (
        <LocalLink href={taxonLink} params={{ taxonId: lastCrumb.id, showTaxon: lastCrumb.id }}>
          <Badge colorPalette={TAXON_BADGE_COLORS.SYNONYM}>
            {t("observation:synonym")+" "+name}
            {lastCrumb?.name && ` ${lastCrumb.name}`}
          </Badge>
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
