import { Box, Select, Stack, Text } from "@chakra-ui/react";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import useDownloadLogsList from "../../common/use-download-log";

export default function Header() {
  const {
    downloadLogData: { ag: aggregate },
    addFilter,
    resetFilter,
    filter
  } = useDownloadLogsList();
  const { t } = useTranslation();

  const totalCount: any = useMemo(() => {
    return aggregate?.reduce((acc, item) => {
      if (filter?.sourceType) {
        return Object.values(
          aggregate.find((item) => {
            if (Object.keys(item)[0] === filter?.sourceType) {
              return Object.keys(item)[0];
            }
          })
        )[0];
      } else {
        return acc + Number(Object.values(item));
      }
    }, 0);
  }, [filter]);

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
