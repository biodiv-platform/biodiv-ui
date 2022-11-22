import { formatDate } from "@biodiv-platform/naksha-commons";
import FormDebugger from "@components/form/debugger";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import useLayerUpload, { MapFileType } from "../use-layer-upload";
import RasterUploadForm from "./raster-form";
import VectorUploadForm from "./vector-form";

export default function LayerUploadForm() {
  const {
    shapeFiles: { dbf, shp },
    uploadLayer,
    mapFileType
  } = useLayerUpload();

  const hForm = useForm<any>({
    resolver: yupResolver(
      yup.object().shape({
        layerName: yup.string().required(),
        layerDescription: yup.string().required(),
        layerType: yup.string().required(),
        titleColumn: yup.string(),
        createdBy: yup.string().required(),
        summaryColumns: yup.array().of(yup.mixed()),
        colorBy: yup.string(),
        attribution: yup.string().required(),
        url: yup.string().notRequired(),
        pdfLink: yup.string().notRequired(),
        tags: yup.string().required(),
        license: yup.string().required(),
        createdDate: yup.date().required(),
        downloadAccess: yup.string().required(),
        layerColumnDescription: yup.object().required()
      })
    ),
    defaultValues: {
      layerType: shp.meta?.type?.toUpperCase(),
      layerColumnDescription: dbf?.meta?.keys
        ? Object.fromEntries(dbf.meta.keys.map((k) => [k, k]))
        : {},
      summaryColumns: []
    }
  });

  const handleOnSubmit = (values) => {
    uploadLayer({
      ...values,
      createdDate: formatDate(values.createdDate),
      layerFileDescription: {
        fileType: "shp",
        encoding: "UTF-8"
      },
      editAccess: "ALL",
      summaryColumns: values.summaryColumns.toString().toLowerCase()
    });
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        {mapFileType === MapFileType.vector && <VectorUploadForm />}
        {mapFileType === MapFileType.raster && <RasterUploadForm />}
      </form>
      <FormDebugger />
    </FormProvider>
  );
}
