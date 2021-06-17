import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { IconButton, Stack } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
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
        {t("filters:taxon_browser.search_results", {
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
          aria-label={t("prev")}
          title={t("prev")}
        />
        <IconButton
          isDisabled={disabled.next}
          onClick={onNext}
          icon={<ArrowForwardIcon />}
          aria-label={t("common:next")}
          title={t("common:next")}
        />
      </div>
    </Stack>
  ) : null;
}
