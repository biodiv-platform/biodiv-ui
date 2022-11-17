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
    mapFileType,
    handleOnSubmitMetaForm
  } = useLayerUpload();

  const hForm = useForm<any>({
    resolver: yupResolver(
      yup.object().shape({
        layerName: yup.string().required(),
        layerDescription: yup.string().required(),
        layerType: yup.string().required(),

        titleColumn: yup.string().when("layerType", {
          is: (v) => v === MapFileType.vector,
          then: yup.string().required("title column is required")
        }),
        colorBy: yup.string().when("layerType", {
          is: (v) => v === MapFileType.vector,
          then: yup.string().required("title column is required")
        }),
        summaryColumns: yup
          .array()
          .of(yup.mixed())
          .when("layerType", {
            is: (v) => v === MapFileType.vector,
            then: yup.array().of(yup.mixed()).required("title column is required")
          }),
        createdBy: yup.string().required(),
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
      layerColumnDescription:
        mapFileType === MapFileType.vector
          ? Object.fromEntries(dbf?.meta?.keys?.map((k) => [k, k]))
          : {},
      summaryColumns: []
    }
  });

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmitMetaForm)}>
        {mapFileType === MapFileType.vector && <VectorUploadForm />}
        {mapFileType === MapFileType.raster && <RasterUploadForm />}
      </form>
    </FormProvider>
  );
}
