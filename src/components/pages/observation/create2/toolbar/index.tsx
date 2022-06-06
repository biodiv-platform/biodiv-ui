import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  SimpleGrid,
  useBreakpointValue
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import CheckIcon from "@icons/check";
import CheckAllIcon from "@icons/check-all";
import CrossIcon from "@icons/cross";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import ImageIcon from "@icons/image";
import MergeIcon from "@icons/merge";
import SplitIcon from "@icons/split";
import { OBSERVATION_BULK_EDIT } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit } from "react-gbus";
import { useFormContext } from "react-hook-form";

import useObservationCreate2 from "../use-observation-create2-hook";

const areValuesEqual = (val1, val2) => {
  if (!val1 || !val2) {
    return false;
  }

  if (val1 instanceof Date && val2 instanceof Date && val1.getTime() === val2.getTime()) {
    return true;
  }

  return val1 === val2;
};

const ToolbarButton = ({ icon, children, ...rest }: any) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return isDesktop ? (
    <Button leftIcon={icon} children={children} {...rest} />
  ) : (
    <IconButton icon={icon} title={children} aria-label={children} {...rest} />
  );
};

export default function Toolbar({ onMerge, onSplit, onRemove }) {
  const { setShowMediaPicker } = useObservationCreate2();
  const form = useFormContext();
  const { t } = useTranslation();

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

  return (
    <Box bg="white" shadow="md" borderBottom="1px" borderColor="gray.300" mb={4}>
      <SimpleGrid className="container-fluid" py={3}>
        <HStack justifyContent="space-between">
          <HStack spacing={4}>
            <ToolbarButton
              type="button"
              onClick={() => setShowMediaPicker(true)}
              icon={<ImageIcon />}
              variant="outline"
              colorScheme="blue"
            >
              {t("observation:toolbar.import")}
            </ToolbarButton>
            <ButtonGroup isAttached={true} variant="outline" colorScheme="orange">
              <ToolbarButton type="button" onClick={onMerge} icon={<MergeIcon />} borderRight={0}>
                {t("observation:toolbar.merge")}
              </ToolbarButton>
              <ToolbarButton type="button" onClick={onSplit} icon={<SplitIcon />}>
                {t("observation:toolbar.split")}
              </ToolbarButton>
            </ButtonGroup>
            <ButtonGroup isAttached={true} variant="outline" colorScheme="teal">
              <ToolbarButton
                type="button"
                onClick={onSelectAll}
                icon={<CheckAllIcon />}
                borderRight={0}
              >
                {t("observation:toolbar.select_all")}
              </ToolbarButton>
              <ToolbarButton type="button" onClick={onSelectNone} icon={<CrossIcon />}>
                {t("observation:toolbar.select_none")}
              </ToolbarButton>
            </ButtonGroup>
            <ButtonGroup isAttached={true} variant="outline" colorScheme="teal">
              <ToolbarButton
                type="button"
                onClick={bulkEdit}
                icon={<EditIcon />}
                variant="outline"
                colorScheme="purple"
              >
                {t("observation:toolbar.edit")}
              </ToolbarButton>
              <ToolbarButton
                type="button"
                onClick={bulkDelete}
                icon={<DeleteIcon />}
                variant="outline"
                colorScheme="red"
              >
                {t("observation:toolbar.delete")}
              </ToolbarButton>
            </ButtonGroup>
          </HStack>
          <SubmitButton colorScheme="green" leftIcon={<CheckIcon />}>
            {t("form:uploader.upload")}
          </SubmitButton>
        </HStack>
      </SimpleGrid>
    </Box>
  );
}
