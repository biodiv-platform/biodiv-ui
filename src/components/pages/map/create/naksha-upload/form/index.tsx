import { formatDate } from "@biodiv-platform/naksha-commons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import LayerUploadDropzone from "../dropzone";
import useLayerUpload, { MapFileType } from "../use-layer-upload";

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
        titleColumn: yup.string().when("layerType", {
          is: (v) => v !== MapFileType.raster,
          then: yup.string().required("title column is required")
        }),
        colorBy: yup.string().when("layerType", {
          is: (v) => v !== MapFileType.raster,
          then: yup.string().required("color by is required")
        }),
        summaryColumns: yup
          .array()
          .of(yup.mixed())
          .when("layerType", {
            is: (v) => v !== MapFileType.raster,
            then: yup.array().of(yup.mixed()).required("summary column is required")
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
      layerType: mapFileType === MapFileType.raster ? "RASTER" : shp.meta?.type?.toUpperCase(),
      layerColumnDescription: dbf?.meta?.keys
        ? Object.fromEntries(dbf.meta.keys.map((k) => [k, k]))
        : {},
      summaryColumns: []
    }
  });

  useEffect(() => {
    hForm.reset({
      layerName: "",
      layerDescription: "",
      layerType:
        mapFileType === MapFileType.raster ? "RASTER" : shp.meta?.type?.toUpperCase() || "",
      titleColumn: "",
      colorBy: "",
      summaryColumns: [],
      createdBy: "",
      attribution: "",
      url: "",
      pdfLink: "",
      tags: "",
      license: "",
      createdDate: undefined,
      downloadAccess: "",
      layerColumnDescription: {}
    });
  }, [mapFileType]);

  useEffect(() => {
    if (mapFileType === MapFileType.raster) {
      hForm.setValue("layerType", "RASTER");
    } else if (shp.meta?.type && !hForm.getValues("layerType")) {
      hForm.setValue("layerType", shp.meta.type.toUpperCase());
    }
  }, [mapFileType, shp.meta?.type]);

  useEffect(() => {
    if (dbf?.meta?.keys) {
      const currentDesc = hForm.getValues("layerColumnDescription") || {};
      const newDesc = { ...currentDesc };
      for (const key of dbf.meta.keys) {
        if (!newDesc[key]) {
          newDesc[key] = key;
        }
      }
      hForm.setValue("layerColumnDescription", newDesc);
    }
  }, [dbf?.meta?.keys]);

  const handleOnSubmit = (values) => {
    uploadLayer({
      ...values,
      createdDate: formatDate(values.createdDate),
      layerFileDescription: {
        fileType: mapFileType === MapFileType.raster ? "tif" : "shp",
        encoding: "UTF-8"
      },
      editAccess: "ALL",
      summaryColumns: values.summaryColumns ? values.summaryColumns.toString().toLowerCase() : ""
    });
  };

  return (
    <FormProvider {...hForm}>
      <form
        onSubmit={hForm.handleSubmit(handleOnSubmit)}
        style={{ height: "100%", width: "100%" }}
      >
        <LayerUploadDropzone />
      </form>
    </FormProvider>
  );
}
