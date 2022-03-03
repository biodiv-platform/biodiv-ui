import { PageHeading } from "@components/@core/layout";
import React, { useState } from "react";

import ColumnSelect from "./column-select";
import CsvDropzoneComponent from "./dropzone";

export default function Curation({ user }) {
  const [csvHeaders, setCsvHeaders] = useState<string[]>();
  const [filePath, setFilePath] = useState();
  return (
    <div>
      <PageHeading>Upload File for Curation</PageHeading>
      <CsvDropzoneComponent
        setCsvHeaders={setCsvHeaders}
        setFilePath={setFilePath}
        userId={user.id}
      />
      {csvHeaders ? (
        <ColumnSelect availableColumns={csvHeaders} filePath={filePath} userId={user.id} />
      ) : (
        <></>
      )}
    </div>
  );
}
