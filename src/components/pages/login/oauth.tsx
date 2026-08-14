import { Box } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import notification from "@utils/notification";
import jwtDecode from "jwt-decode";
import { useLayoutEffect, useRef, useState } from "react";

interface IGoogleClaims {
  email: string;
  name: string;
}

export default function Oauth({ text, onSuccess }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.getBoundingClientRect().width;
      if (width) setButtonWidth(Math.floor(width));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={containerRef} width="100%" mb={2} display="flex" justifyContent="center" pb={2}>
      {buttonWidth > 0 && (
        <GoogleLogin
          theme="filled_blue"
          text={text}
          shape="rectangular"
          width={buttonWidth}
          onSuccess={(credentialResponse) => {
            try {
              const credential = credentialResponse.credential;

              if (!credential) {
                notification("Google login failed: missing credential");
                return;
              }

              const claims = jwtDecode<IGoogleClaims>(credential);

              onSuccess({
                profileObj: { email: claims.email, name: claims.name },
                tokenId: credential
              });
            } catch (err) {
              notification("Google login failed");
            }
          }}
          onError={() => notification("Google login failed")}
        />
      )}
    </Box>
  );
}
