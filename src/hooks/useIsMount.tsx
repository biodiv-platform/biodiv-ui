import { useEffect, useRef } from "react";

/**
 * hook that returns boolean if true it's a first render else subsequent render
 * @warning Avoid this wherever possible
 *
 */
export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};
