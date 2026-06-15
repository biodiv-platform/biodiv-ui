import { useEffect, useState } from "react";

export default function useIsMobileDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      // Check for standard mobile/tablet user agents
      const isMobileOS = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);

      // Workaround for iPadOS 13+: Apple changed the iPad User-Agent to match macOS,
      // but we can identify them by checking for Mac OS + Touch capabilities.
      const isMacWithTouch = /macintosh/i.test(userAgent) && navigator.maxTouchPoints > 0;

      setIsMobile(isMobileOS || isMacWithTouch);
    };

    checkDevice();
  }, []);

  return isMobile;
}
