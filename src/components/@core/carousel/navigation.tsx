import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import React from "react";

const NavigationBox = styled.div`
  font-size: 1.5em;
  color: var(--white);

  .right,
  .left {
    border-radius: 50%;
    margin: 0 1rem;
    width: 3rem;
    height: 3rem;
    position: absolute;
    top: calc(50% - 1.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right {
    right: 0;
  }
  .left {
    left: 0;
  }
`;

function CarouselNavigation({ carousel, resourcesLength }) {
  const isHidden = !(carousel && resourcesLength > 1);
  const { t } = useTranslation();

  return (
    <NavigationBox className={isHidden ? "hidden" : "shown"}>
      <button
        className="left"
        aria-label={t("OBSERVATION.SLIDER_LEFT")}
        onClick={() => carousel.scrollPrev()}
      >
        <ArrowBackIcon />
      </button>
      <button
        className="right"
        aria-label={t("OBSERVATION.SLIDER_RIGHT")}
        onClick={() => carousel.scrollNext()}
      >
        <ArrowForwardIcon />
      </button>
    </NavigationBox>
  );
}

export default CarouselNavigation;
