import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  SimpleGrid,
  useBreakpointValue
} from "@chakra-ui/react";
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
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit } from "react-gbus";
import { useFormContext } from "react-hook-form";

import useObservationCreateNext from "../use-observation-create-next-hook";
import SelectionCounter from "./selection-counter";

const areValuesEqual = (val1, val2) => {
  if (!val1 || !val2) {
    return false;
  }

  if (val1 instanceof Date && val2 instanceof Date && val1.getTime() === val2.getTime()) {
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
        if (!areValuesEqual(selectedObservation[key], value)) {
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

    emit(OBSERVATION_BULK_EDIT, initialEditObject);
  };

  const onDraftMediaOpen = () => {
    setShowMediaPicker(true);
    media.sync();
  };

  return (
    <Box position="sticky" bottom={0} w="full" p={4}>
      <Box bg="white" border="1px" borderColor="gray.300" borderRadius="md">
        <SimpleGrid p={4}>
          {isDesktop ? (
            <Flex justifyContent="space-between" gap={4} alignItems="center">
              <Flex flexFlow="wrap" gap={4}>
                <Menu>
                  <MenuButton
                    as={Button}
                    type="button"
                    leftIcon={<ImageIcon />}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    colorScheme="blue"
                  >
                    {t("observation:toolbar.import")}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={onBrowse} icon={<SmartphoneIcon />}>
                      {t("form:uploader.device")}
                    </MenuItem>
                    <MenuItem onClick={onDraftMediaOpen} icon={<CloudIcon />}>
                      {t("form:uploader.draft")}
                    </MenuItem>
                  </MenuList>
                </Menu>

                <ButtonGroup isAttached={true} variant="outline" colorScheme="orange">
                  <Button type="button" onClick={onMerge} leftIcon={<MergeIcon />} borderRight={0}>
                    {t("observation:toolbar.merge")}
                  </Button>
                  <Button type="button" onClick={onSplit} leftIcon={<SplitIcon />}>
                    {t("observation:toolbar.split")}
                  </Button>
                </ButtonGroup>
                <ButtonGroup isAttached={true} variant="outline" colorScheme="teal">
                  <Button
                    type="button"
                    onClick={onSelectAll}
                    leftIcon={<CheckAllIcon />}
                    borderRight={0}
                  >
                    {t("observation:toolbar.select_all")}
                  </Button>
                  <Button type="button" onClick={onSelectNone} leftIcon={<CrossIcon />}>
                    {t("observation:toolbar.select_none")}
                  </Button>
                </ButtonGroup>
                <ButtonGroup isAttached={true} variant="outline" colorScheme="teal">
                  <Button
                    type="button"
                    onClick={bulkEdit}
                    leftIcon={<EditIcon />}
                    variant="outline"
                    colorScheme="purple"
                  >
                    {t("observation:toolbar.edit")} <SelectionCounter />
                  </Button>
                  <Button
                    type="button"
                    onClick={bulkDelete}
                    leftIcon={<DeleteIcon />}
                    variant="outline"
                    colorScheme="red"
                  >
                    {t("observation:toolbar.delete")}
                  </Button>
                </ButtonGroup>
              </Flex>
              <Box>
                <SubmitButton colorScheme="green" leftIcon={<CheckIcon />}>
                  {t("form:uploader.upload")}
                </SubmitButton>
              </Box>
            </Flex>
          ) : (
            <Flex gap={4} justifyContent="space-between">
              <Menu isLazy={true}>
                <MenuButton
                  as={Button}
                  maxW="120px"
                  colorScheme="gray"
                  leftIcon={<HamburgerIcon />}
                >
                  {t("observation:actions")}
                </MenuButton>
                <MenuList>
                  <MenuGroup title={t("observation:toolbar.import")}>
                    <MenuItem color="blue.600" onClick={onBrowse} icon={<SmartphoneIcon />}>
                      {t("form:uploader.device")}
                    </MenuItem>
                    <MenuItem color="blue.600" onClick={onDraftMediaOpen} icon={<CloudIcon />}>
                      {t("form:my_uploads")}
                    </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup title="Actions">
                    <MenuItem color="orange.600" onClick={onMerge} icon={<MergeIcon />}>
                      {t("observation:toolbar.merge")}
                    </MenuItem>
                    <MenuItem color="orange.600" onClick={onSplit} icon={<SplitIcon />}>
                      {t("observation:toolbar.split")}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem color="teal.600" onClick={onSelectAll} icon={<CheckAllIcon />}>
                      {t("observation:toolbar.select_all")}
                    </MenuItem>
                    <MenuItem color="teal.600" onClick={onSelectNone} icon={<CrossIcon />}>
                      {t("observation:toolbar.select_none")}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem color="purple.600" onClick={bulkEdit} icon={<EditIcon />}>
                      {t("observation:toolbar.edit")} <SelectionCounter />
                    </MenuItem>
                    <MenuItem color="red.600" onClick={bulkDelete} icon={<DeleteIcon />}>
                      {t("observation:toolbar.delete")}
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
              <SubmitButton colorScheme="green" leftIcon={<CheckIcon />}>
                {t("form:uploader.upload")}
              </SubmitButton>
            </Flex>
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
