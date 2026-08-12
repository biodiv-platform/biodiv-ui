import { Button } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import notification from "@utils/notification";

export default function Oauth({ onSuccess, text, mb = 4 }) {
  const login = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const profile = await res.json();

        onSuccess({
          profileObj: { email: profile.email, name: profile.name },
          tokenId: tokenResponse.access_token
        });
      } catch (err) {
        notification("Google login failed");
      }
    },
    onError: () => notification("Google login failed")
  });

  return (
    <Button w="full" mb={mb} onClick={() => login()} colorPalette="blue">
      {text}
    </Button>
  );
}
