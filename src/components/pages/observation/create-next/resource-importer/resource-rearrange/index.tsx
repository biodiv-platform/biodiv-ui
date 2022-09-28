import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Signal } from "@preact/signals-react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import NewGroup from "./new-group";
import { ResourceGroup } from "./resource-group";

interface ResourceRearrangeProps {
  resourceGroups: Signal<any[]>;
}

export default function ResourceRearrange({ resourceGroups }: ResourceRearrangeProps) {
  const { t } = useTranslation();

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const _resourceGroups = Array.from(resourceGroups.value);
    const el = _resourceGroups[source.droppableId][source.index];
    _resourceGroups[source.droppableId].splice(source.index, 1);

    if (destination.droppableId === "new") {
      _resourceGroups.push([el]);
    } else {
      _resourceGroups[destination.droppableId].splice(destination.index, 0, el);
    }

    resourceGroups.value = _resourceGroups;
  };

  const addNewGroup = () => {
    resourceGroups.value = [...resourceGroups.value, []];
  };

  const removeGroup = (index) => {
    const _resourceGroups = Array.from(resourceGroups.value);
    _resourceGroups.splice(Number(index), 1);

    resourceGroups.value = _resourceGroups;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex direction="column">
        {resourceGroups.value.map((resourceGroup, index) => (
          <Box key={index}>
            <Box as="span" py={2} px={4} borderTopRadius="md" bg="gray.100">
              {t("observation:observation")} #{index+1}
            </Box>
            <ResourceGroup
              resourceGroup={resourceGroup}
              index={index.toString()}
              removeGroup={removeGroup}
            />
          </Box>
        ))}
        <NewGroup onAdd={addNewGroup} />
      </Flex>
    </DragDropContext>
  );
}
