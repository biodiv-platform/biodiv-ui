import { Box, Button, CheckboxGroup, Collapse, SimpleGrid, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { UserGroupIbp } from "@interfaces/observation";
import { axSaveUserGroups } from "@services/observation.service";
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
  observationId;
}

export default function GroupPost({
  groups = [],
  selectedDefault,
  observationId
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
    const { success, data } = await axSaveUserGroups(observationId, groupsList);
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
        rightIcon="edit"
        variantColor="blue"
        ref={editButtonRef}
        onClick={onToggle}
      >
        Edit
      </Button>

      <SimpleGrid columns={[1, 1, 2, 3]} spacing={4} hidden={isOpen}>
        <GroupBox
          link={DEFAULT_GROUP.webAddress}
          icon={DEFAULT_GROUP.icon}
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
        <CheckboxGroup
          defaultValue={selectedGroups}
          onChange={setSelectedGroups}
          display="grid"
          className="custom-checkbox-group"
          gridGap={4}
          gridTemplateColumns={["repeat(1,1fr)", "repeat(1,1fr)", `repeat(2,1fr)`, `repeat(3,1fr)`]}
        >
          {groups.length > 0 &&
            groups.map((o) => (
              <Checkbox key={o.id} value={o.id.toString()} label={o.name} icon={o.icon} />
            ))}
        </CheckboxGroup>
        <Box mt={2}>
          <Button
            size="sm"
            variantColor="blue"
            aria-label="Save"
            type="submit"
            onClick={handleOnSave}
          >
            {t("SAVE")}
          </Button>
          <Button size="sm" ml={2} variantColor="gray" aria-label="Cancel" onClick={handleOnCancel}>
            {t("CLOSE")}
          </Button>
        </Box>
      </Collapse>
    </>
  );
}
