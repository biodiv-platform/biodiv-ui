import { GoogleLogin } from "@react-oauth/google";
import notification from "@utils/notification";
import jwtDecode from "jwt-decode";

interface IGoogleClaims {
  email: string;
  name: string;
}

export default function Oauth({ onSuccess }) {
  return (
    <GoogleLogin
      theme="filled_blue"
      text="signin_with"
      shape="rectangular"
      width="100%"
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
  );
}
