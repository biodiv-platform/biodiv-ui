import { Alert, AlertIcon, Box, Button, Code } from "@chakra-ui/core";
import React, { useState } from "react";
import { FormContextValues } from "react-hook-form";

export default function FormDebugger({ form }: { form: FormContextValues<any> }) {
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
      <Button w="100%" variantColor="red" onClick={update} mb={2}>
        Refresh Values
      </Button>
      <Code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Code>
    </Box>
  );
}
