import { Box } from "@chakra-ui/react";
import React, { useMemo } from "react";

interface IBlurBoxProps {
  children;

  bg?: string;
  bgOpacity?: number;
  fallbackColor?: string;

  blur?: number;
  negativeBlur?: number;

  height?;
  width?;
}

const defaultProps = {
  fallbackColor: "black",
  blur: 40,
  negativeBlur: 30
};

function BlurBox(props: IBlurBoxProps) {
  const [p, blurBoxProps]: any = useMemo(() => {
    const p = { ...defaultProps, ...props };

    const bgSize = `${100 + p.negativeBlur}%`;

    return [
      p,
      {
        className: "blur-box-bg",
        opacity: 0.9,
        style: { filter: `blur(${p.blur}px)` },
        backgroundImage: `url("${p.bg}")`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        h: bgSize,
        w: bgSize,
        position: "absolute",
        left: `-${p.negativeBlur / 2}%`,
        top: `-${p.negativeBlur / 2}%`,
        bottom: bgSize,
        right: bgSize
      }
    ];
  }, [props]);

  return (
    <Box
      className="blur-box"
      h={p.height}
      w={p.width}
      overflow="hidden"
      position="relative"
      bg={p.fallbackColor}
    >
      <Box {...blurBoxProps} />
      <Box
        className="blur-box-content"
        position={{ base: "inherit", md: "absolute" }}
        top={0}
        left={0}
        bottom={0}
        right={0}
      >
        {p.children}
      </Box>
    </Box>
  );
}

export default BlurBox;
