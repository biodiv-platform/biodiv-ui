import { Box, Select, Stack, Text } from "@chakra-ui/react";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useDownloadLogsList from "../../common/use-download-log";

export default function Header() {
  const {
    downloadLogData: { ag: aggregate, n: totalCount },
    addFilter,
    resetFilter
  } = useDownloadLogsList();
  const { t } = useTranslation();

  const handleOnSort = (e) => {
    const v = e?.target?.value;

    if (v.length > 0 && v !== "All") {
      addFilter("sourceType", v.toString());
    } else {
      resetFilter();
    }
  };

  return (
    aggregate && (
      <Stack
        m={3}
        justifyContent="space-between"
        alignItems="center"
        isInline={true}
        spacing={4}
        mb={4}
      >
        <Text color="gray.600">
          {format(totalCount)} {t("user:download_logs")}
        </Text>

        <Box>
          <Select maxW="10rem" aria-label={t("common:list.sort_by")} onChange={handleOnSort}>
            <option>All</option>
            {aggregate?.map((item) => (
              <option>{`${Object.keys(item)[0]}`}</option>
            ))}
          </Select>
        </Box>
      </Stack>
    )
  );
}
