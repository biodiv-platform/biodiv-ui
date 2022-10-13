import { AspectRatio, Box, IconButton } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import AddIcon from "@icons/add";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function NewGroup({ onAdd }) {
  const { t } = useTranslation();

  return (
    <Droppable droppableId="new" direction="horizontal">
      {(provided) => (
        <Box
          bg="gray.100"
          borderRadius="md"
          minH="auto"
          p={4}
          mb={2}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <AspectRatio ratio={1} w="134px">
            <IconButton
              p={2}
              border="2px dashed"
              borderColor="gray.400"
              color="gray.400"
              fontSize="2xl"
              boxSize="full"
              bg="none!important"
              onClick={onAdd}
              icon={<AddIcon />}
              aria-label={t("common:add")}
            />
          </AspectRatio>
        </Box>
      )}
    </Droppable>
  );
}
