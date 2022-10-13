import { Box, CloseButton, Flex } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import React from "react";

import { Resource } from "./resource";

export const ResourceGroup = ({ index, resourceGroup, removeGroup }) => (
  <Droppable droppableId={index} direction="horizontal">
    {(provided) => (
      <Flex
        overflowY="auto"
        bg="gray.100"
        borderRadius="md"
        mb={6}
        h="auto"
        position="relative"
        p={2}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {resourceGroup.length ? (
          resourceGroup.map((resource, index) => (
            <Resource key={resource.hashKey} resource={resource} index={index} />
          ))
        ) : (
          <Box minH="150px">
            <CloseButton
              position="absolute"
              top={0}
              right={0}
              m={2}
              onClick={() => removeGroup(index)}
            />
          </Box>
        )}
        {provided.placeholder}
      </Flex>
    )}
  </Droppable>
);
