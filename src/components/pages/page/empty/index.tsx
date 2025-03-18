import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Center, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import { axCheckUserGroupFounderOrAdmin } from "@services/usergroup.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

export default function EmptyPageComponent() {
  const { currentGroup } = useGlobalState();
  const { t } = useTranslation();

  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    axCheckUserGroupFounderOrAdmin(currentGroup.id, true).then(setCanCreate);
  }, []);

  return (
    <div className="container mt">
      <Center textAlign="center" height="calc(100vh - var(--heading-height))">
        <div>
          <Text fontSize="xl" mb={4}>
            {t("page:empty")}
          </Text>
          {canCreate && (
            <LocalLink prefixGroup={true} href="/page/create">
              <Button as="a" colorPalette="blue" rightIcon={<ArrowForwardIcon />}>
                {t("page:create.title")}
              </Button>
            </LocalLink>
          )}
        </div>
      </Center>
    </div>
  );
}
