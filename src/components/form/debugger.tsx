import { Alert, AlertIcon, Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { UseFormMethods } from "react-hook-form";

export default function FormDebugger({ form }: { form: UseFormMethods<Record<string, any>> }) {
  const [data, setData] = useState(form.getValues());

  const update = () => {
    console.debug(form);
    setData(form.getValues());
  };

  return (
    <Box my={4}>
      <Alert status="warning" mb={2} borderRadius="md">
        <AlertIcon />
        FOR DEVELOPMENT PURPOSES ONLY
      </Alert>
      <Button w="100%" colorScheme="red" onClick={update} mb={2}>
        Refresh Values
      </Button>
      <Box bg="gray.100" p={4}>
        Values
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
      <Box bg="red.100" p={4}>
        Errors
        <pre>{JSON.stringify(form.errors, null, 2)}</pre>
      </Box>
    </Box>
  );
}
