import styled from "@emotion/styled";
import React from "react";

const List = styled.ol`
  li {
    display: inline-block;
    padding: 0.4rem;
    border-radius: 50%;
    margin-left: 0.6rem;
    background: white;
    cursor: pointer;
    transition: 0.1s ease;
    opacity: 0.2;

    &.active {
      opacity: 1;
    }
  }
`;

interface IIndicatorsProps {
  size: number;
  currentSlide: number;
  scrollTo;
}

export default function Indicators({ size, currentSlide, scrollTo }: IIndicatorsProps) {
  return (
    <List>
      {Array(size)
        .fill(null)
        .map((_, index) => (
          <li
            key={index}
            onClick={() => scrollTo(index)}
            className={index === currentSlide ? "active" : ""}
          />
        ))}
    </List>
  );
}
