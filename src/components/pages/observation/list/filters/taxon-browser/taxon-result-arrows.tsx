import { IconButton, Stack } from "@chakra-ui/core";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import useTranslation from "@configs/i18n/useTranslation";
import React, { useEffect, useState } from "react";

export default function TaxonResultArrows({ resultsCount }) {
  const [currentIndex, setCurrentIndex] = useState(resultsCount);
  const [disabled, setDisabled] = useState({ prev: true, next: true });
  const { t } = useTranslation();

  const onPrevious = () => setCurrentIndex(currentIndex - 1);

  const onNext = () => setCurrentIndex(currentIndex + 1);

  useEffect(() => {
    if (currentIndex > -1) {
      document
        .querySelectorAll(".rc-tree-node-selected")
        ?.[currentIndex]?.scrollIntoView({ block: "center" });
      setDisabled({ prev: currentIndex === 0, next: currentIndex === resultsCount - 1 });
    }
  }, [currentIndex]);

  useEffect(() => {
    setCurrentIndex(-1);
    resultsCount > 0 && onNext();
  }, [resultsCount]);

  return resultsCount > 1 ? (
    <Stack isInline={true} mt={3} alignItems="center" justify="space-between" className="fadeInUp">
      <div>
        {t("FILTERS.TAXON_BROWSER.SEARCH_RESULTS", {
          currentIndex: currentIndex + 1,
          resultsCount
        })}
      </div>
      <div>
        <IconButton
          isDisabled={disabled.prev}
          onClick={onPrevious}
          icon={<ArrowBackIcon />}
          mx={2}
          aria-label={t("PREV")}
          title={t("PREV")}
        />
        <IconButton
          isDisabled={disabled.next}
          onClick={onNext}
          icon={<ArrowForwardIcon />}
          aria-label={t("NEXT")}
          title={t("NEXT")}
        />
      </div>
    </Stack>
  ) : null;
}
