import styled from "@emotion/styled";
import { GallerySlider } from "@interfaces/utility";
import { Mq } from "mq-styled-components";
import React, { useState } from "react";

import SideBar from "./sidebar";
import Slides from "./slides";

const CarouselBox = styled.div`
  display: flex;
  border-radius: 0.5rem;
  margin-bottom: 2.5rem;
  overflow: hidden;
  position: relative;
  color: white;
  background: var(--gray-100);

  .blur-box {
    flex-shrink: 0;
    width: 430px;
    z-index: 1;
  }

  ${Mq.max.md} {
    .blur-box {
      width: 40%;
    }
    .content {
      padding: 1.8rem;
    }
    p {
      font-size: 1rem;
    }
    h1 {
      font-size: 1.6rem;
    }
  }

  ${Mq.max.sm} {
    display: block;
    .blur-box-content {
      width: 100%;
      position: initial !important;
    }
    .blur-box-bg {
      z-index: -1;
    }
    .blur-box {
      width: 100%;
    }
    .content {
      padding: 1.2rem;
    }
    h1 {
      font-size: 1.6rem;
    }
  }
`;

interface ICarouselProps {
  featured: GallerySlider[];
}

export default function Carousel({ featured }: ICarouselProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  return featured ? (
    <CarouselBox className="fadeInUp">
      <Slides featured={featured} slideIndex={slideIndex} onChange={setSlideIndex} />
      <SideBar featured={featured} slideIndex={slideIndex} />
    </CarouselBox>
  ) : null;
}
