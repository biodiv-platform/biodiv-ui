import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Alert } from "../ui/alert";

export default function FormDebugger() {
  const [data, setData] = useState<any>();
  const form = useFormContext();

  const update = () => {
    setData(form.getValues());
  };

  useEffect(() => {
    update();
  }, [form]);

  return (
    <Box my={4}>
      <Alert status="warning" mb={2} borderRadius="md">
        FOR DEVELOPMENT PURPOSES ONLY
      </Alert>
      <Button w="100%" colorPalette="red" onClick={update} mb={2}>
        Refresh Values
      </Button>
      <Box bg="gray.100" p={4}>
        Values
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
      <Box bg="red.100" p={4}>
        Errors
        {Object.entries(form?.formState?.errors || {})?.map(([name, { type, message }]: any) => (
          <div key={message + name}>
            <b>{name}</b>: [{type}] <pre>{JSON.stringify(message, null, 2)}</pre>
          </div>
        ))}
      </Box>
    </Box>
  );
}
