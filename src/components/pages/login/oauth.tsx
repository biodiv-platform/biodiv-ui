import { Button } from "@chakra-ui/core";
import notification from "@utils/notification";
import React from "react";
import GoogleLogin from "react-google-login";

export default function Oauth({ onSuccess, text, mb = 4 }) {
  const onFailure = ({ error }) => {
    notification(error);
  };

  return (
    <GoogleLogin
      clientId={process.env.NEXT_PUBLIC_GOOGLE_APP_ID}
      render={(renderProps) => (
        <Button
          w="full"
          mb={mb}
          onClick={renderProps.onClick}
          isDisabled={renderProps.disabled}
          variantColor="messenger"
        >
          {text}
        </Button>
      )}
      onAutoLoadFinished={() => null}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy="single_host_origin"
    />
  );
}
