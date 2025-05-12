import { IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

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
        aria-label={t("common:slider_left")}
        onClick={prev}
        opacity={0.2}
        _hover={{ opacity: 1 }}
        disabled={current === 0}
        variant={"subtle"}
      >
        <LuArrowLeft />
      </IconButton>
      <IconButton
        className="right"
        aria-label={t("common:slider_right")}
        onClick={next}
        opacity={0.2}
        _hover={{ opacity: 1 }}
        disabled={current === total - 1}
        variant={"subtle"}
      >
        <LuArrowRight />
      </IconButton>
    </NavigationBox>
  );
}

export default CarouselNavigation;
