import { useEffect, useState } from "react";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly>();

  useEffect(() => {
    const observeTarget = ref?.current;

    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
