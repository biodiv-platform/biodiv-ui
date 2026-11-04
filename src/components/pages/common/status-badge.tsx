import { Badge, Box } from "@chakra-ui/react";
import TaxonShowModal from "@components/pages/taxonomy/list/table/taxon-modal";
import { TAXON_BADGE_COLORS } from "@static/constants";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";

interface TaxonStatusBadgeProps {
  reco;
  taxonId;
  crumbs;
  name;
}

function TaxonStatusBadge({ reco, taxonId, crumbs, name }: TaxonStatusBadgeProps) {
  const { t } = useTranslation();
  const [selectedTaxonId, setSelectedTaxonId] = useState<any>(null);

  const handleClose = () => setSelectedTaxonId(null);

  const renderBadge = () => {
    switch (reco?.status) {
      case "ACCEPTED":
        return (
          <Badge
            colorPalette={TAXON_BADGE_COLORS.ACCEPTED}
            cursor={taxonId != null ? "pointer" : "default"}
            h="fit-content"
            variant="outline"
            onClick={
              taxonId != null
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedTaxonId(taxonId);
                  }
                : undefined
            }
            _hover={{
              bg: `${TAXON_BADGE_COLORS.ACCEPTED}.subtle`
            }}
          >
            {t("common:accepted")}
            <LuInfo />
          </Badge>
        );

      case "SYNONYM": {
        const [lastCrumb] = crumbs?.slice(-1) || [{ name: null }];
        const targetId = lastCrumb?.id;
        return (
          <Badge
            colorPalette={TAXON_BADGE_COLORS.SYNONYM}
            cursor={targetId != null ? "pointer" : "default"}
            variant="outline"
            h="fit-content"
            onClick={
              targetId != null
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedTaxonId(targetId);
                  }
                : undefined
            }
          >
            {t("observation:synonym") + " " + name}
            {lastCrumb?.name && ` ${lastCrumb.name}`}
          </Badge>
        );
      }

      default:
        return !reco?.scientificName ? (
          <Badge colorPalette="red" h="fit-content" variant="outline">
            {t("observation:help_identify")}
          </Badge>
        ) : null;
    }
  };

  const badge = renderBadge();
  if (!badge) {
    return null;
  }

  return (
    <>
      <Box as="span" display="inline-flex" alignItems="center">
        {badge}
      </Box>
      {selectedTaxonId != null && (
        <TaxonShowModal taxonId={selectedTaxonId} onClose={handleClose} />
      )}
    </>
  );
}

export default TaxonStatusBadge;
