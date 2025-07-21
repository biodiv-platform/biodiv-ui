import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";

import { Alert } from "@/components/ui/alert";

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
      {t("processing")}
    </Alert>
  ) : (
    <Alert m={6} borderRadius="md" status={success ? "success" : "error"}>
      {t(success ? "SUCCESS" : "INVALID_REQUEST")}
    </Alert>
  );
}
