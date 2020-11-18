import { Box } from "@chakra-ui/react";
import React from "react";

interface IBlurBoxProps {
  children;

  bg: string;
  bgOpacity?: number;
  fallbackColor?: string;

  blur?: number;
  negativeBlur?: number;

  height?;
  width?;
}

function BlurBox({
  children,
  bg,
  fallbackColor = "black",
  blur = 40,
  negativeBlur = 30,
  height,
  width
}: IBlurBoxProps) {
  const bgSize = `${100 + negativeBlur}%`;

  return (
    <Box
      className="blur-box"
      h={height}
      w={width}
      overflow="hidden"
      position="relative"
      bg={fallbackColor}
    >
      <Box
        className="blur-box-bg"
        opacity={0.9}
        style={{ filter: `blur(${blur}px)` }}
        backgroundImage={`url("${bg}")`}
        backgroundSize="cover"
        backgroundPosition="center center"
        h={bgSize}
        w={bgSize}
        position="absolute"
        left={`-${negativeBlur / 2}%`}
        top={`-${negativeBlur / 2}%`}
        bottom={bgSize}
        right={bgSize}
      />
      <Box
        className="blur-box-content"
        position={{ base: "inherit", md: "absolute" }}
        top={0}
        left={0}
        bottom={0}
        right={0}
      >
        {children}
      </Box>
    </Box>
  );
}

export default BlurBox;
