import { Flex, Select, Text } from "@chakra-ui/react";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import EditIcon from "@icons/edit";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { CURATED_STATUS } from "./table/data";
import useCurateEdit from "./use-curate-edit";

const Actions = () => {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { rows, isShow, canEdit, datasetId } = useCurateEdit();

  const handleOnChange = (e) => rows.updateFilter("curatedStatus", e.target.value);

  const handleOnEdit = () => router.push(`/text-curation/edit/${datasetId}`);

  return (
    <Flex gap={4} alignItems="center">
      <Select onChange={handleOnChange} size="sm">
        <option value="">ALL</option>
        {Object.keys(CURATED_STATUS).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </Select>

      {isShow && canEdit && (
        <SimpleActionButton
          icon={<EditIcon />}
          title={t("common:edit")}
          onClick={handleOnEdit}
          colorScheme="teal"
        />
      )}
    </Flex>
  );
};

export default function TextCurationHeader() {
  const { initialData } = useCurateEdit();

  return (
    <>
      <PageHeading actions={<Actions />} mb={2} className="fadeInUp">
        {initialData.title}
      </PageHeading>
      <Text mb={6}>{initialData.description}</Text>
    </>
  );
}