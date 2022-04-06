import { Box, Button } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import CheckBoxItems from "@components/pages/observation/create/form/user-groups/checkbox";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

// import notification, { NotificationType } from "@utils/notification";

export default function GroupPost() {
  const [selectedGroups, setSelectedGroups] = useState<any>();
  const { t } = useTranslation();
  const { onClose, loggedInUserGroups: groups } = useObservationFilter();

  const handleOnSave = async () => {
    onClose();
  };

  const handleOnCancel = () => {
    onClose();
  };

  return (
    <Box maxH="10rem" p={4}>
      {groups && groups?.length > 0 ? (
        <CheckBoxItems
          gridColumns={[1, 1, 2, 3]}
          options={groups}
          defaultValue={selectedGroups}
          onChange={setSelectedGroups}
        />
      ) : (
        <div>{t("common:no_groups_joined")}</div>
      )}

      <Box pt={4} pb={4}>
        <Button size="sm" colorScheme="blue" aria-label="Save" type="submit" onClick={handleOnSave}>
          {t("common:save")}
        </Button>
        <Button size="sm" ml={2} colorScheme="gray" aria-label="Cancel" onClick={handleOnCancel}>
          {t("common:close")}
        </Button>
      </Box>
    </Box>
  );
}
