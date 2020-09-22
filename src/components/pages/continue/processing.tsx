import { Alert, AlertIcon } from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import React, { useEffect } from "react";

interface ProcessingProps {
  loading: boolean;
  success: boolean;
  redirect?: boolean;
}

export default function Processing({ success, loading, redirect = true }: ProcessingProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();

  useEffect(() => {
    if (success && redirect) {
      router.push("/show", true);
    }
  }, [success]);

  return loading ? (
    <Alert m={6} borderRadius="md">
      <AlertIcon />
      {t("PROCESSING")}
    </Alert>
  ) : (
    <Alert m={6} borderRadius="md" status={success ? "success" : "error"}>
      <AlertIcon />
      {t(success ? "SUCCESS" : "INVALID_REQUEST")}
    </Alert>
  );
}
