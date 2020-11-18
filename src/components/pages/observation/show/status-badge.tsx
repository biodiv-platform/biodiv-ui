import { Badge, Link } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import { RecoIbp } from "@interfaces/observation";
import { TAXON_BADGE_COLORS } from "@static/constants";
import React from "react";

function ObservationStatusBadge({ reco }: { reco: RecoIbp; maxVotedRecoId: number }) {
  const { t } = useTranslation();

  const taxonLink = `/namelist/index?taxon=${reco?.taxonId}`;

  switch (reco?.status) {
    case "ACCEPTED":
      return (
        <Link href={taxonLink}>
          <Badge colorScheme={TAXON_BADGE_COLORS.ACCEPTED}>{t("OBSERVATION.ACCEPTED")}</Badge>
        </Link>
      );

    case "SYNONYM":
      const [lastCrumb] = reco.breadCrumbs?.slice(-1) || [{ name: null }];
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
        <Badge colorScheme="red">{t("OBSERVATION.HELP_IDENTIFY")}</Badge>
      ) : null;
  }
}

export default ObservationStatusBadge;
