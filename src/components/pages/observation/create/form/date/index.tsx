import { Box, Divider, SimpleGrid } from "@chakra-ui/core";
import Datepicker from "@components/form/datepicker";
import RichTextarea from "@components/form/rich-textarea";
import Select from "@components/form/select";
import SelectAsync from "@components/form/select-async";
import useTranslation from "@configs/i18n/useTranslation";
import { axQueryTagsByText } from "@services/observation.service";
import React from "react";

import { DATE_ACCURACY_OPTIONS } from "../options";

export default function DateInputs({ form, showTags = true }) {
  const { t } = useTranslation();

  const onTagsQuery = async (q) => {
    const { data } = await axQueryTagsByText(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  return (
    <>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={4}>
        <Box>
          <SimpleGrid columns={showTags ? [1, 1, 3, 3] : [1]} spacing={4}>
            <Datepicker
              name="observedOn"
              label={t("OBSERVATION.OBSERVED_ON")}
              style={{ gridColumn: "1/3" }}
              form={form}
              isRequired={true}
              subscribe={true}
              mb={showTags ? 4 : 0}
            />
            <Select
              name="dateAccuracy"
              label={t("OBSERVATION.DATE_ACCURACY")}
              options={DATE_ACCURACY_OPTIONS}
              form={form}
            />
          </SimpleGrid>
          {showTags && (
            <SelectAsync
              name="tags"
              label={t("OBSERVATION.TAGS")}
              hint={t("OBSERVATION.TAGS_HINT")}
              form={form}
              multiple={true}
              onQuery={onTagsQuery}
              mb={2}
            />
          )}
        </Box>
        <RichTextarea name="notes" label={t("OBSERVATION.NOTES")} form={form} />
      </SimpleGrid>
      {showTags && <Divider mb={3} />}
    </>
  );
}
