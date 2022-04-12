import { Select, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import React from "react";

import { CURATED_STATUS } from "./table/data";
import useCurateEdit from "./use-curate-edit";

const Filters = () => {
  const { rows } = useCurateEdit();

  const handleOnChange = (e) => {
    rows.updateFilter("curatedStatus", e.target.value);
  };

  return (
    <div>
      <Select onChange={handleOnChange}>
        <option value="">ALL</option>
        {Object.keys(CURATED_STATUS).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default function TextCurationHeader() {
  const { initialData } = useCurateEdit();

  return (
    <>
      <PageHeading actions={<Filters />} mb={2} className="fadeInUp">
        {initialData.title}
      </PageHeading>
      <Text mb={6}>{initialData.description}</Text>
    </>
  );
}
