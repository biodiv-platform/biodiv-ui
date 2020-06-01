import {
  Box,
  Button,
  CheckboxGroup,
  Collapse,
  FormControl,
  FormLabel,
  SimpleGrid,
  Stack,
  Textarea,
  useDisclosure
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { Featured, UserGroupIbp } from "@interfaces/observation";
import { axGroupsFeature, axGroupsUnFeature } from "@services/observation.service";
import { DEFAULT_GROUP } from "@static/constants";
import { getGroupImageThumb } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useRef, useState } from "react";

import Checkbox from "../../create/form/user-groups/checkbox";
import GroupBox from "./group-box";

interface IGroupFeatureProps {
  groups: UserGroupIbp[];
  selectedDefault: Featured[];
  observationId;
}

export default function GroupFeature({
  groups,
  selectedDefault,
  observationId
}: IGroupFeatureProps) {
  const [groupsN, setGroupsN] = useState<UserGroupIbp[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [finalGroups, setFinalGroups] = useState([]);
  const [description, setDescription] = useState("");

  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const editButtonRef = useRef(null);

  useEffect(() => {
    if (groups) {
      const groupsNT = [DEFAULT_GROUP, ...groups.map((g) => ({ ...g, icon: g.icon }))];
      const selectedGroupsT = selectedDefault.map((g) => `${g.userGroup}`);
      setGroupsN(groupsNT);
      setSelectedGroups(selectedGroupsT);
      setFinalGroups(groupsNT.filter((g) => selectedGroupsT.includes(`${g.id}`)));
    }
  }, [groups]);

  const updateFinalGroups = (data = []) => {
    const selectedGroupsT = data.map((g) => `${g.userGroup}`);
    setSelectedGroups(selectedGroupsT);
    setFinalGroups(groupsN.filter((g) => selectedGroupsT.includes(`${g.id}`)));
  };

  const handleOnFeature = async () => {
    const groupsList = selectedGroups.map((i) => Number(i));
    const { success, data } = await axGroupsFeature({
      notes: description,
      objectId: observationId,
      objectType: "observation",
      userGroup: groupsList
    });
    if (success) {
      updateFinalGroups(data);
      notification(t("OBSERVATION.GROUPS_UPDATED"), NotificationType.Success);
      editButtonRef.current.focus();
      onClose();
    }
  };

  const handleOnUnfeature = async () => {
    const { success, data } = await axGroupsUnFeature(observationId, selectedGroups);
    if (success) {
      updateFinalGroups(data);
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
        variant="link"
        rightIcon="edit"
        variantColor="blue"
        ref={editButtonRef}
        onClick={onToggle}
      >
        Edit
      </Button>

      <SimpleGrid columns={[1, 1, 3, 3]} spacing={4} hidden={isOpen}>
        {finalGroups.map((og) => (
          <GroupBox
            key={og.id}
            link={og.webAddress}
            icon={og.id ? getGroupImageThumb(og.icon) : og.icon}
            name={og.name}
          />
        ))}
      </SimpleGrid>

      <Collapse isOpen={isOpen}>
        <CheckboxGroup
          value={selectedGroups}
          onChange={setSelectedGroups}
          display="grid"
          className="custom-checkbox-group"
          gridGap={4}
          gridTemplateColumns={["repeat(1,1fr)", "repeat(1,1fr)", "repeat(3,1fr)", "repeat(3,1fr)"]}
        >
          {groupsN.map((o) => (
            <Checkbox key={o.id} value={`${o.id}`} label={o.name} icon={o.icon} />
          ))}
        </CheckboxGroup>
        <Box mt={2}>
          <FormControl>
            <FormLabel htmlFor="description">Why Featuring?</FormLabel>
            <Textarea
              id="description"
              resize="none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <Stack isInline={true} spacing={2} mt={2}>
            <Button
              size="sm"
              variantColor="blue"
              aria-label="Save"
              type="submit"
              onClick={handleOnFeature}
            >
              {t("OBSERVATION.FEATURE")}
            </Button>
            <Button
              size="sm"
              variantColor="red"
              aria-label="Save"
              type="submit"
              onClick={handleOnUnfeature}
            >
              {t("OBSERVATION.UNFEATURE")}
            </Button>
            <Button size="sm" variantColor="gray" aria-label="Cancel" onClick={handleOnCancel}>
              {t("CLOSE")}
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </>
  );
}
