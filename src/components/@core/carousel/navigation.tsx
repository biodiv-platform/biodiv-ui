import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import useTranslation from "@hooks/use-translation";
import React from "react";

const NavigationBox = styled.div`
  .right,
  .left {
    margin: 0 1rem;
    border-radius: 50%;
    position: absolute;
    top: calc(50% - 1.5rem);
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

function CarouselNavigation({ prev, next, current, total }) {
  const { t } = useTranslation();

  return (
    <NavigationBox>
      <IconButton
        className="left"
        aria-label={t("OBSERVATION.SLIDER_LEFT")}
        icon={<ArrowBackIcon />}
        onClick={prev}
        opacity={0.2}
        _hover={{ opacity: 1 }}
        disabled={current === 0}
      />
      <IconButton
        className="right"
        aria-label={t("OBSERVATION.SLIDER_RIGHT")}
        icon={<ArrowForwardIcon />}
        onClick={next}
        opacity={0.2}
        _hover={{ opacity: 1 }}
        disabled={current === total - 1}
      />
    </NavigationBox>
  );
}

export default CarouselNavigation;
