import { Flex } from "@chakra-ui/react";
import { Signal } from "@preact/signals-react";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

import { ResourceGroup } from "./resource-group";

interface ResourceRearrangeProps {
  resourceGroups: Signal<any[]>;
}

export default function ResourceRearrange({ resourceGroups }: ResourceRearrangeProps) {
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const _resourceGroups = Array.from(resourceGroups.value);
    const el = _resourceGroups[source.droppableId][source.index];
    _resourceGroups[source.droppableId].splice(source.index, 1);
    _resourceGroups[destination.droppableId].splice(destination.index, 0, el);

    resourceGroups.value = _resourceGroups;
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
          <ResourceGroup
            key={index}
            resourceGroup={resourceGroup}
            index={index.toString()}
            removeGroup={removeGroup}
          />
        ))}
      </Flex>
    </DragDropContext>
  );
}
