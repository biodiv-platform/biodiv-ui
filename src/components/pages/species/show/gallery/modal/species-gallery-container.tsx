import { ObservationCreateProvider } from "@components/pages/observation/create/form/uploader/use-observation-resources";
import { DB_CONFIG } from "@static/observation-create";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import IndexedDBProvider from "use-indexeddb";

import SpeciesDropzoneField from "./pull-media/dropzone-field";

export default function SpeciesFieldContainer(props) {
  const { t } = useTranslation();

  return (
    <IndexedDBProvider
      config={DB_CONFIG}
      loading={t("common:loading")}
      fallback={t("observation:idb_not_supported")}
    >
      <ObservationCreateProvider
        licensesList={props.licensesList}
        observationAssets={props.form.control._defaultValues[props.name]}
      >
        <SpeciesDropzoneField {...props} />
      </ObservationCreateProvider>
    </IndexedDBProvider>
  );
}
