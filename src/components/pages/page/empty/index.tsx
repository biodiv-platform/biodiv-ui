import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Center, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { axCheckUserGroupFounderOrAdmin } from "@services/usergroup.service";
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
            {t("PAGE.EMPTY")}
          </Text>
          {canCreate && (
            <LocalLink prefixGroup={true} href="/page/create">
              <Button as="a" colorScheme="blue" rightIcon={<ArrowForwardIcon />}>
                {t("PAGE.CREATE.TITLE")}
              </Button>
            </LocalLink>
          )}
        </div>
      </Center>
    </div>
  );
}
