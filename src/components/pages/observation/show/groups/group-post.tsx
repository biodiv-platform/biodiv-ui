import { Box, Button, CheckboxGroup, Collapse, SimpleGrid, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import EditIcon from "@icons/edit";
import { UserGroupIbp } from "@interfaces/observation";
import { DEFAULT_GROUP } from "@static/constants";
import { getGroupLink } from "@utils/basic";
import { getGroupImageThumb } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React, { useRef, useState } from "react";

import Checkbox from "../../create/form/user-groups/checkbox";
import GroupBox from "./group-box";

interface IGroupPostProps {
  groups: UserGroupIbp[];
  selectedDefault: UserGroupIbp[];
  resourceId;
  saveUserGroupsFunc;
}

export default function GroupPost({
  groups = [],
  selectedDefault,
  resourceId,
  saveUserGroupsFunc
}: IGroupPostProps) {
  const [finalGroups, setFinalGroups] = useState(selectedDefault);
  const [selectedGroups, setSelectedGroups] = useState<any[]>(
    selectedDefault.map((g) => g.id.toString())
  );
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const editButtonRef = useRef(null);

  const handleOnSave = async () => {
    const groupsList = selectedGroups.map((i) => Number(i));
    const { success, data } = await saveUserGroupsFunc(resourceId, groupsList);
    if (success) {
      setFinalGroups(data);
      notification(t("OBSERVATION.GROUPS_UPDATED"), NotificationType.Success);
      editButtonRef.current.focus();
      onClose();
    }
  };

  const handleOnCancel = () => {
    onClose();
    editButtonRef.current.focus();
  };

  return (
    <>
      <Button
        mb={2}
        p={1}
        pl={0}
        variant="link"
        rightIcon={<EditIcon />}
        colorScheme="blue"
        ref={editButtonRef}
        onClick={onToggle}
      >
        Edit
      </Button>

      <SimpleGrid columns={[1, 1, 2, 3]} spacing={4} hidden={isOpen}>
        <GroupBox
          link={DEFAULT_GROUP.webAddress}
          icon={`${DEFAULT_GROUP.icon}?h=40`}
          name={DEFAULT_GROUP.name}
        />
        {finalGroups.map((og) => (
          <GroupBox
            key={og.id}
            link={getGroupLink(og.webAddress)}
            icon={getGroupImageThumb(og.icon, 40)}
            name={og.name}
          />
        ))}
      </SimpleGrid>

      <Collapse isOpen={isOpen}>
        <CheckboxGroup defaultValue={selectedGroups} onChange={setSelectedGroups}>
          <SimpleGrid gridGap={4} columns={[1, 1, 2, 3]} className="custom-checkbox-group">
            {groups.length > 0 &&
              groups.map((o) => (
                <Checkbox key={o.id} value={o.id.toString()} label={o.name} icon={o.icon} />
              ))}
          </SimpleGrid>
        </CheckboxGroup>
        <Box mt={2}>
          <Button
            size="sm"
            colorScheme="blue"
            aria-label="Save"
            type="submit"
            onClick={handleOnSave}
          >
            {t("SAVE")}
          </Button>
          <Button size="sm" ml={2} colorScheme="gray" aria-label="Cancel" onClick={handleOnCancel}>
            {t("CLOSE")}
          </Button>
        </Box>
      </Collapse>
    </>
  );
}
