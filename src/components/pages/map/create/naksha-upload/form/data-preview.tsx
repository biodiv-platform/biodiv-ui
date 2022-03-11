import { Box, Heading } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import useLayerUpload from "../use-layer-upload";
import DataTable from "./data-table";

export default function DataPreview() {
  const { shapeFiles } = useLayerUpload();
  const { t } = useTranslation();

  const columns = useMemo(
    () =>
      shapeFiles.dbf.meta.keys.map((key) => ({
        name: key,
        selector: key
      })),
    [shapeFiles.dbf]
  );

  return (
    <Box mb={6}>
      <Heading size="md" mb={4}>
        🏁 {t("map:data_preview")}
      </Heading>
      <DataTable columns={columns} data={shapeFiles.dbf.meta.rows} />
    </Box>
  );
}
