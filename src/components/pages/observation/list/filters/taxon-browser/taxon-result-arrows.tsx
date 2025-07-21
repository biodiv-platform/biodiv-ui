import { IconButton, Stack } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { LuMoveLeft, LuMoveRight } from "react-icons/lu";

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
    <Stack
      direction={"row"}
      mt={3}
      alignItems="center"
      justify="space-between"
      className="fadeInUp"
    >
      <div>
        {t("filters:taxon_browser.search_results", {
          currentIndex: currentIndex + 1,
          resultsCount
        })}
      </div>
      <div>
        <IconButton
          disabled={disabled.prev}
          onClick={onPrevious}
          mx={2}
          aria-label={t("prev")}
          title={t("prev")}
        >
          <LuMoveLeft />
        </IconButton>
        <IconButton
          disabled={disabled.next}
          onClick={onNext}
          aria-label={t("common:next")}
          title={t("common:next")}
        >
          <LuMoveRight />
        </IconButton>
      </div>
    </Stack>
  ) : null;
}
