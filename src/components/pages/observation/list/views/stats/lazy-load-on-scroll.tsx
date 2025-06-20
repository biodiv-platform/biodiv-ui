// components/LazyLoadOnScroll.tsx
import React, { Suspense } from "react";
import { useInView } from "react-intersection-observer";

export default function LazyLoadOnScroll({
  children,
  fallback = "Loading...",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref}>
      {inView && (
        <Suspense fallback={<div>{fallback}</div>}>
          {children}
        </Suspense>
      )}
    </div>
  );
}
