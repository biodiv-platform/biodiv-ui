import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  SimpleGrid,
  Stack,
  Textarea,
  useDisclosure
} from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
import EditIcon from "@icons/edit";
import { Featured, UserGroupIbp } from "@interfaces/observation";
import { DEFAULT_GROUP } from "@static/constants";
import { getGroupImageThumb } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useRef, useState } from "react";

import CheckBoxItems from "../../create/form/user-groups/checkbox";
import GroupBox from "./group-box";

interface IGroupFeatureProps {
  groups: UserGroupIbp[];
  selectedDefault: Featured[];
  resourceId;
  featureFunc;
  unfeatureFunc;
  resourceType;
}

export default function GroupFeature({
  groups,
  selectedDefault,
  resourceId,
  featureFunc,
  unfeatureFunc,
  resourceType
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
      setGroupsN(groupsNT || []);
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
    const { success, data } = await featureFunc({
      notes: description,
      objectId: resourceId,
      objectType: resourceType,
      userGroup: groupsList
    });
    success && afterFeatureUpdated(data);
  };

  const handleOnUnfeature = async () => {
    const { success, data } = await unfeatureFunc(resourceId, selectedGroups);
    success && afterFeatureUpdated(data);
  };

  const afterFeatureUpdated = (data) => {
    updateFinalGroups(data);
    notification(t("OBSERVATION.GROUPS_UPDATED"), NotificationType.Success);
    editButtonRef.current.focus();
    onClose();
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
        rightIcon={<EditIcon />}
        colorScheme="blue"
        ref={editButtonRef}
        onClick={onToggle}
      >
        {t("EDIT")}
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

      <Collapse in={isOpen}>
        {groupsN.length > 0 && (
          <CheckBoxItems
            gridColumns={[1, 1, 3, 3]}
            options={groupsN}
            defaultValue={selectedGroups}
            onChange={setSelectedGroups}
          />
        )}
        <Box mt={2}>
          <FormControl>
            <FormLabel htmlFor="description">{t("OBSERVATION.WHY_FEATURING")}</FormLabel>
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
              colorScheme="blue"
              aria-label="Save"
              type="submit"
              onClick={handleOnFeature}
            >
              {t("OBSERVATION.FEATURE")}
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              aria-label="Save"
              type="submit"
              onClick={handleOnUnfeature}
            >
              {t("OBSERVATION.UNFEATURE")}
            </Button>
            <Button size="sm" colorScheme="gray" aria-label="Cancel" onClick={handleOnCancel}>
              {t("CLOSE")}
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </>
  );
}
