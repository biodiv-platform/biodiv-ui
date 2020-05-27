import { Icon } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";
import styled from "@emotion/styled";

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
        <Icon name="arrow-back" />
      </button>
      <button
        className="right"
        aria-label={t("OBSERVATION.SLIDER_RIGHT")}
        onClick={() => carousel.scrollNext()}
      >
        <Icon name="arrow-forward" />
      </button>
    </NavigationBox>
  );
}

export default CarouselNavigation;
