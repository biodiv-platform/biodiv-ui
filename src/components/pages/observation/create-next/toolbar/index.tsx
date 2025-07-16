import { Box, Button, ButtonGroup, Flex, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import CheckIcon from "@icons/check";
import CheckAllIcon from "@icons/check-all";
import CloudIcon from "@icons/cloud";
import CrossIcon from "@icons/cross";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import ImageIcon from "@icons/image";
import MergeIcon from "@icons/merge";
import SmartphoneIcon from "@icons/smartphone";
import SplitIcon from "@icons/split";
import { OBSERVATION_BULK_EDIT } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit } from "react-gbus";
import { useFormContext } from "react-hook-form";
import { LuChevronDown, LuMenu } from "react-icons/lu";

import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger
} from "@/components/ui/menu";

import useObservationCreateNext from "../use-observation-create-next-hook";
import SelectionCounter from "./selection-counter";

const areValuesEqual = (val1, val2, key) => {
  if (!val1 || !val2) {
    return false;
  }

  if (Array.isArray(val1) && Array.isArray(val2) && JSON.stringify(val1) === JSON.stringify(val2)) {
    return true;
  }

  if (key === "observedOn" && dayjs(val1).diff(dayjs(val2), "day") === 0) {
    return true;
  }

  return val1 === val2;
};

export default function Toolbar({ onMerge, onSplit, onRemove, onBrowse }) {
  const { setShowMediaPicker, media } = useObservationCreateNext();
  const form = useFormContext();
  const { t } = useTranslation();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const toggleSelection = (selectAll?) => {
    const { o: all } = form.getValues();
    for (let i = 0; i < all.length; i++) {
      if (all.isSelected !== selectAll) form.setValue(`o.${i}.isSelected`, selectAll);
    }
  };

  const onSelectAll = () => toggleSelection(true);

  const onSelectNone = () => toggleSelection(false);

  const bulkDelete = () => {
    const { o: all } = form.getValues();

    all
      .reduce(
        (indexList, currentValue, index) =>
          currentValue.isSelected ? indexList.concat(index) : indexList,
        []
      )
      .reverse() // we need remove it from end so observation index won't change
      .map(onRemove);
  };

  const bulkEdit = () => {
    const { o: all } = form.getValues();
    const allSelected = all.filter((o) => o.isSelected);
    const commonProps: string[] = [];

    if (allSelected.length === 0) {
      notification(
        t("observation:toolbar.errors.no_observations_selected"),
        NotificationType.Warning
      );
      return;
    }

    for (const [key, value] of Object.entries(allSelected[0]) as any) {
      let isCommon = true;

      for (const selectedObservation of allSelected) {
        if (!areValuesEqual(selectedObservation[key], value, key)) {
          isCommon = false;
          break;
        }
      }

      if (isCommon) {
        commonProps.push(key);
      }
    }

    const initialEditObject = Object.fromEntries(
      Object.entries(allSelected[0]).filter(([key]) => commonProps.includes(key))
    );

    emit(OBSERVATION_BULK_EDIT, { data: initialEditObject });
  };

  const onDraftMediaOpen = () => {
    setShowMediaPicker(true);
    media.sync();
  };

  return (
    <Box position="sticky" bottom={0} w="full" className="container-fluid" py={4}>
      <Box bg="white" border="1px" borderColor="gray.400" borderRadius="md" shadow="md">
        <SimpleGrid p={4}>
          {isDesktop ? (
            <Flex justifyContent="space-between" gap={4} alignItems="center">
              <Flex flexFlow="wrap" gap={4}>
                <MenuRoot>
                  <MenuTrigger type="button">
                    <Button variant={"outline"}>
                      <ImageIcon size={"xs"} />
                      {t("observation:toolbar.import")}
                      <LuChevronDown />
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem onClick={onBrowse} value="device">
                      <SmartphoneIcon size={"xs"} />
                      {t("form:uploader.device")}
                    </MenuItem>
                    <MenuItem onClick={onDraftMediaOpen} value="draftMedia">
                      <CloudIcon size={"xs"} />
                      {t("form:uploader.draft")}
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>

                <ButtonGroup attached={true} variant="outline" colorPalette="orange">
                  <Button type="button" onClick={onMerge} borderRight={0}>
                    <MergeIcon size={"xs"} />
                    {t("observation:toolbar.merge")}
                  </Button>
                  <Button type="button" onClick={onSplit}>
                    <SplitIcon size={"xs"} />
                    {t("observation:toolbar.split")}
                  </Button>
                </ButtonGroup>
                <ButtonGroup attached={true} variant="outline" colorPalette="teal">
                  <Button type="button" onClick={onSelectAll} borderRight={0}>
                    <CheckAllIcon size={"xs"} />
                    {t("observation:toolbar.select_all")}
                  </Button>
                  <Button type="button" onClick={onSelectNone}>
                    <CrossIcon size={"xs"} />
                    {t("observation:toolbar.select_none")}
                  </Button>
                </ButtonGroup>
                <ButtonGroup attached={true} variant="outline" colorPalette="teal">
                  <Button type="button" onClick={bulkEdit} variant="outline" colorPalette="purple">
                    <EditIcon size={"xs"} />
                    {t("observation:toolbar.edit")} <SelectionCounter />
                  </Button>
                  <Button type="button" onClick={bulkDelete} variant="outline" colorPalette="red">
                    <DeleteIcon size={"xs"} />
                    {t("observation:toolbar.delete")}
                  </Button>
                </ButtonGroup>
              </Flex>
              <Box>
                <SubmitButton colorPalette="green" leftIcon={<CheckIcon />}>
                  {t("form:uploader.upload")}
                </SubmitButton>
              </Box>
            </Flex>
          ) : (
            <Flex gap={4} justifyContent="space-between">
              <MenuRoot lazyMount={true}>
                <MenuTrigger type="button" maxW="120px">
                  <Button variant={"outline"}>
                    <LuMenu />
                    {t("observation:actions")}
                  </Button>
                </MenuTrigger>
                <MenuContent>
                  <MenuItemGroup title={t("observation:toolbar.import")}>
                    <MenuItem color="blue.600" onClick={onBrowse} value="device">
                      <SmartphoneIcon size={"xs"} />
                      {t("form:uploader.device")}
                    </MenuItem>
                    <MenuItem color="blue.600" onClick={onDraftMediaOpen} value="draftMedia">
                      <CloudIcon size={"xs"} />
                      {t("form:my_uploads")}
                    </MenuItem>
                  </MenuItemGroup>
                  <MenuSeparator />
                  <MenuItemGroup title="Actions">
                    <MenuItem color="orange.600" onClick={onMerge} value="merge">
                      <MergeIcon size={"xs"} />
                      {t("observation:toolbar.merge")}
                    </MenuItem>
                    <MenuItem color="orange.600" onClick={onSplit} value="split">
                      <SplitIcon size={"xs"} />
                      {t("observation:toolbar.split")}
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem color="teal.600" onClick={onSelectAll} value="selectAll">
                      <CheckAllIcon size={"xs"} />
                      {t("observation:toolbar.select_all")}
                    </MenuItem>
                    <MenuItem color="teal.600" onClick={onSelectNone} value="selectNone">
                      <CrossIcon size={"xs"} />
                      {t("observation:toolbar.select_none")}
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem color="purple.600" onClick={bulkEdit} value="fill">
                      <EditIcon size={"xs"} />
                      {t("observation:toolbar.edit")} <SelectionCounter />
                    </MenuItem>
                    <MenuItem color="red.600" onClick={bulkDelete} value="delete">
                      <DeleteIcon size={"xs"} />
                      {t("observation:toolbar.delete")}
                    </MenuItem>
                  </MenuItemGroup>
                </MenuContent>
              </MenuRoot>
              <SubmitButton colorPalette="green" leftIcon={<CheckIcon />}>
                {t("form:uploader.upload")}
              </SubmitButton>
            </Flex>
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
