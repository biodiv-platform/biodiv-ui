import { Button, Flex } from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import React from "react";

import useCurateEdit from "../use-curate-edit";

export default function ActionButton({ row, name }) {
  const { rows } = useCurateEdit();

  const handleOnEdit = () => rows.setEditing({ row, name });

  return (
    <div title={row[name]}>
      <Flex gap={2}>
        {row[name]}
        <Button colorScheme="blue" variant="link" minW="auto" onClick={handleOnEdit}>
          <EditIcon />
        </Button>
      </Flex>
    </div>
  );
}
