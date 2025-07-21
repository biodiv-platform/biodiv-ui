import { type ImageProps, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface FallbackImageProps extends ImageProps {
  fallbackSrc: string;
}

export function ImageWithFallback({ src, fallbackSrc, alt = "", ...props }: FallbackImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false);

    if (!src) {
      return; // We'll handle this in the render
    }

    if (typeof window !== "undefined") {
      const image = new window.Image();
      image.src = src;
      image.onload = () => setHasError(false);
      image.onerror = () => setHasError(true);
    }
  }, [src]);

  // Determine which source to use
  const imageSrc = src && !hasError ? src : fallbackSrc;

  return <Image src={imageSrc} alt={alt} {...props} />;
}
