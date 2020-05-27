import styled from "@emotion/styled";
import React from "react";

const List = styled.ol`
  li {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    margin: 0;
    border: 2px solid white;
    border-radius: 50%;
    margin-left: 0.4rem;
    cursor: pointer;
    transition: 0.1s ease;

    &.active {
      background: white;
    }
  }
`;

interface IIndicatorsProps {
  size: number;
  currentIndex: number;
  scrollTo;
}

export default function Indicators({ size, currentIndex, scrollTo }: IIndicatorsProps) {
  return (
    <List>
      {Array(size)
        .fill(null)
        .map((_, index) => (
          <li
            key={index}
            onClick={() => scrollTo(index)}
            className={index === currentIndex ? "active" : ""}
          />
        ))}
    </List>
  );
}
