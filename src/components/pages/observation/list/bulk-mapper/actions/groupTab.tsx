import { Box, Button, Flex, HStack, Input } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import CheckBoxItems from "@components/pages/observation/create/form/user-groups/checkbox";
import { bulkActions } from "@components/pages/observation/list/bulk-mapper";
import { axGetObservationMapData } from "@services/observation.service";
import notification, { NotificationType } from "@utils/notification";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

export default function GroupPost() {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const {
    onClose,
    authorizedUserGroupList: groups,
    filter,
    selectAll,
    bulkObservationIds
  } = useObservationFilter();
  const [selectedGroups, setSelectedGroups] = useState<any>([]);
  const [filterGroups, setFilterGroups] = useState<any>(groups);

  const handleOnSave = async (bulkAction) => {
    const params = {
      ...filter,
      selectAll,
      view: "bulkMapping",
      bulkUsergroupIds: selectedGroups?.toString() || "",
      bulkObservationIds: bulkObservationIds?.toString() || "",
      bulkAction
    };

    const { success } = await axGetObservationMapData(params, {}, true);
    if (success) {
      notification(t("observation:bulk_action.success"), NotificationType.Success);
    } else {
      notification(t("observation:bulk_action.failure"), NotificationType.Error);
    }
    router.push("/observation/list", true, { ...filter }, true);

    onClose();
  };

  const onQuery = debounce((e) => {
    setFilterGroups(
      groups?.filter((i) => i.name?.toLowerCase().match(e.target.value.toLowerCase()))
    );
  }, 200);

  return groups && groups.length ? (
    <Box>
      <Flex alignItems="center" mb={4} justifyContent="flex-start">
        <Input
          w="20rem"
          name="search"
          type="search"
          onChange={onQuery}
          placeholder={t("header:search")}
        />
      </Flex>

      {filterGroups && filterGroups?.length > 0 && (
        <Box height="10rem" mb={4} overflowX="clip" overflowY="scroll">
          <CheckBoxItems
            gridColumns={[1, 1, 2, 3]}
            options={filterGroups}
            defaultValue={selectedGroups}
            onChange={setSelectedGroups}
          />
        </Box>
      )}

      <HStack m={2} justifyContent="flex-end">
        <Button
          disabled={selectedGroups.length <= 0}
          size="sm"
          variant="outline"
          colorScheme="blue"
          aria-label="Save"
          type="submit"
          onClick={() => handleOnSave(bulkActions.post)}
        >
          {t("common:post")}
        </Button>
        <Button
          disabled={selectedGroups.length <= 0}
          size="sm"
          variant="outline"
          ml={2}
          colorScheme="red"
          aria-label="Unpost"
          onClick={() => handleOnSave(bulkActions.unPost)}
        >
          {t("common:un_post")}
        </Button>
      </HStack>
    </Box>
  ) : (
    <div>{t("common:no_groups_joined")}</div>
  );
}
