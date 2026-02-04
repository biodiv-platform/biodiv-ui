import { Carousel, IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

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

function CarouselNavigation() {
  return (
    <NavigationBox>
      <Carousel.PrevTrigger asChild>
        <IconButton size="md" variant="subtle" rounded={"full"}>
          <LuChevronLeft />
        </IconButton>
      </Carousel.PrevTrigger>
      <Carousel.NextTrigger asChild>
        <IconButton size="md" variant="subtle" rounded={"full"}>
          <LuChevronRight />
        </IconButton>
      </Carousel.NextTrigger>
    </NavigationBox>
  );
}

export default CarouselNavigation;
