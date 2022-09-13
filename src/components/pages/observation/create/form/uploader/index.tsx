import { DB_CONFIG } from "@static/observation-create";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";
import IndexedDBProvider from "use-indexeddb";

import DropzoneField, { IDropzoneProps } from "./field";
import { ObservationCreateProvider } from "./use-observation-resources";

interface IDropzoneExtendedProps extends IDropzoneProps {
  licensesList;
}

const DropzoneFieldContainer = (props: IDropzoneExtendedProps) => {
  const form = useFormContext();
  const { t } = useTranslation();

  return (
    <IndexedDBProvider
      config={DB_CONFIG}
      loading={t("common:loading")}
      fallback={t("observation:idb_not_supported")}
    >
      <ObservationCreateProvider
        licensesList={props.licensesList}
        observationAssets={form.control._defaultValues[props.name]}
      >
        <DropzoneField {...props} />
      </ObservationCreateProvider>
    </IndexedDBProvider>
  );
};

export default DropzoneFieldContainer;
