import { PageHeading } from "@components/@core/layout";
import React, { useState } from "react";
import ColumnSelect from "./column-select";

import CsvDropzoneComponent from "./dropzone";
/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

export default function Curation({ user }) {
  // console.log("user is")
  // console.log(user)
  const [csvHeaders, setCsvHeaders] = useState<string[]>();
  return (
    <div>
      <PageHeading>Curate Spiderindia Files </PageHeading>
      <CsvDropzoneComponent setCsvHeaders={setCsvHeaders} />
      {csvHeaders ? <ColumnSelect availableColumns={csvHeaders} /> : <></>}
    </div>
  );
}
