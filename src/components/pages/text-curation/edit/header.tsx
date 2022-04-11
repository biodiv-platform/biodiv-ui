import { Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import React from "react";

import useCurateEdit from "./use-curate-edit";

export default function TextCurationHeader() {
  const { initialData } = useCurateEdit();

  return (
    <>
      <PageHeading mb={2} className="fadeInUp">
        {initialData.title}
      </PageHeading>
      <Text mb={6}>{initialData.description}</Text>
    </>
  );
}
