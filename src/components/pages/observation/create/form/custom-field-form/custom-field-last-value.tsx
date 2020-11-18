import { Button } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import ls from "local-storage-json";
import React, { useEffect, useState } from "react";

export default function CustomFieldLastValue({ id, name, set }) {
  const { t } = useTranslation();
  const [show, canShow] = useState(false);
  const [cfValue, setCfValue] = useState<any>();

  const use = () => {
    set(name, cfValue);
    canShow(false);
  };

  useEffect(() => {
    const lastCFValue = ls.get(`cf-${id}`);
    if (lastCFValue?.value) {
      canShow(true);
      setCfValue(lastCFValue?.value);
    }
  }, []);

  return show ? (
    <Button
      type="button"
      variant="link"
      colorScheme="blue"
      fontSize="xs"
      title={cfValue.toString()}
      onClick={use}
    >
      {t("OBSERVATION.USE_LAST_VALUE")}
    </Button>
  ) : null;
}
