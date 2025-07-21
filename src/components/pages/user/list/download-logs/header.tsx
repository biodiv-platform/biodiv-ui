import { Box, Stack } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

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
      <PageHeading
        size={"3xl"}
        actions={
          <Stack direction="row" gap={4} mb={4}>
            <Box>
              <NativeSelectRoot>
                <NativeSelectField
                  maxW="10rem"
                  aria-label={t("common:list.sort_by")}
                  onChange={handleOnSort}
                >
                  <option>All</option>
                  {aggregate?.map((item) => (
                    <option>{`${Object.keys(item)[0]}`}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Box>
          </Stack>
        }
      >
        ⬇️ {t("user:download_logs")} ({format(totalCount)})
      </PageHeading>
    )
  );
}
