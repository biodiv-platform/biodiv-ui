import React, { useEffect, useRef, useState } from "react";

interface FlashProps {
  value: any;
  duration?: number;
  flashStyle?: React.CSSProperties;
  children: React.ReactNode;
}

export default function Flash({
  value,
  duration = 500,
  flashStyle = { background: "var(--chakra-colors-yellow-100)" },
  children
}: FlashProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsFlashing(true);
      const timeout = setTimeout(() => setIsFlashing(false), duration);
      prevValue.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value, duration]);

  return (
    <span
      style={{
        transition: "background 500ms ease",
        ...(isFlashing ? flashStyle : {})
      }}
    >
      {children}
    </span>
  );
}
