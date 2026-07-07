import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

interface FlashProps {
  value: unknown;
  children: React.ReactNode;
}

export default function Flash({ value, children }: FlashProps) {
  const [flash, setFlash] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      setFlash(true);

      const timer = setTimeout(() => {
        setFlash(false);
      }, 500);

      previousValue.current = value;

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <Box
      as="span"
      bg={flash ? "yellow.100" : "transparent"}
      transition="background-color 0.5s ease"
      borderRadius="sm"
      px={1}
    >
      {children}
    </Box>
  );
}
