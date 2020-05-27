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
  bgOpacity = 0.9,
  fallbackColor = "black",
  blur = 40,
  negativeBlur = 30,
  height,
  width
}: IBlurBoxProps) {
  const bgSize = `${100 + negativeBlur}%`;

  return (
    <div
      className="blur-box"
      style={{
        height,
        width,
        overflow: "hidden",
        position: "relative",
        background: fallbackColor
      }}
    >
      <div
        className="blur-box-bg"
        style={{
          opacity: bgOpacity,
          filter: `blur(${blur}px)`,

          backgroundImage: `url("${bg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center center",

          height: bgSize,
          width: bgSize,

          position: "absolute",
          left: `-${negativeBlur / 2}%`,
          top: `-${negativeBlur / 2}%`,
          bottom: bgSize,
          right: bgSize
        }}
      />
      <div
        className="blur-box-content"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default BlurBox;
