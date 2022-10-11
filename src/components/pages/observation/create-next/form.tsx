import { Box, useToast } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import { AssetStatus } from "@interfaces/custom";
import {
  OBSERVATION_BULK_EDIT_DONE,
  OBSERVATION_IMPORT_RESOURCE,
  SYNC_OBSERVATION,
  SYNC_SINGLE_OBSERVATION_DONE,
  SYNC_SINGLE_OBSERVATION_ERROR
} from "@static/events";
import { DEFAULT_TOAST } from "@static/observation-create";
import deepmerge from "deepmerge";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit, useListener } from "react-gbus";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useImmer } from "use-immer";
import * as Yup from "yup";

import BulkEditor from "./bulk-editor";
import {
  handleOnSingleObservationSubmit,
  prepareObservationData,
  preProcessObservations
} from "./common";
import ImageGrid from "./image-grid";
import { MediaPicker } from "./media-picker";
import ResourceImporter from "./resource-importer";
import Toolbar from "./toolbar";
import UploadProgress from "./upload-progress";
import useObservationCreateNext from "./use-observation-create-next-hook";

const deepMergeObservations = (prev, current) => {
  const _prev = Object.fromEntries(Object.entries(prev).filter((o) => o[1]));
  const _current = Object.fromEntries(Object.entries(current).filter((o) => o[1]));
  return deepmerge(_prev, _current);
};

export default function ObservationCreateNextForm({ onBrowse }) {
  const toast = useToast();
  const toastIdRef = React.useRef<any>();
  const { t } = useTranslation();
  const { currentGroup, languageId, user } = useGlobalState();

  const { sortedCFList, speciesGroups } = useObservationCreateNext();

  const [uploadSummery, setUploadSummery] = useImmer({
    isSubmittd: false,
    payload: [] as any[],
    data: [] as any[]
  });

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        o: Yup.array()
          .of(
            Yup.object().shape({
              sGroup: Yup.mixed().required(),

              // recoData
              taxonCommonName: Yup.string().nullable(),
              scientificNameTaxonId: Yup.mixed().nullable(),
              taxonScientificName: Yup.string().nullable(),
              confidence: Yup.number().nullable().notRequired(),
              languageId: Yup.mixed().nullable().notRequired(),

              // Extra
              notes: Yup.string().nullable(),
              tags: Yup.array().nullable(),
              basisOfRecords: Yup.string().required(),

              // Date and Location
              observedOn: Yup.string().required(),
              dateAccuracy: Yup.string().required(),
              observedAt: Yup.string().required(),
              locationScale: Yup.string().required(),
              latitude: Yup.number().required(),
              longitude: Yup.number().required(),
              hidePreciseLocation: Yup.boolean(),

              facts: Yup.object().notRequired(),
              userGroupId: Yup.array(),
              resources: Yup.array()
                .of(
                  Yup.object().shape({
                    status: Yup.number().equals([AssetStatus.Uploaded]).required()
                  })
                )
                .min(1)
                .required(),

              //custom field data - detailed validation in browse modal
              customFields: Yup.array()
                .of(
                  Yup.object().shape({
                    isRequired: Yup.boolean(),
                    value: Yup.mixed().when("isRequired", {
                      is: true,
                      then: Yup.mixed().required(),
                      otherwise: Yup.mixed().nullable()
                    })
                  })
                )
                .nullable()
            })
          )
          .min(1)
      })
    ),
    defaultValues: {
      o: []
    }
  });

  const o = useFieldArray({ name: "o", control: hForm.control });

  /**
   * updates observation at index in `fieldArray`
   *
   * @param {*} index
   * @param {*} data
   */
  const updateObservationByKey = (data, index, callback) => {
    callback(index, prepareObservationData(data));
  };

  /**
   * merges two or more observations
   *
   */
  const handleOnMerge = () => {
    const { o: all } = hForm.getValues();

    // finds first `isSelected: true` index
    const selectedFirstIndex = all.findIndex((obs) => obs.isSelected);

    const selectedIndexes: number[] = [];

    for (const [idx, obs] of all.entries()) {
      if (obs.isSelected && idx !== selectedFirstIndex) selectedIndexes.push(idx);
    }

    // removes other `isSelected: true` objects
    o.remove(selectedIndexes.reverse());

    // final merged observation
    const o1 = all
      .filter((obs) => obs.isSelected)
      .reduce((prev, current) => deepMergeObservations(current, prev), { isSelected: false });

    updateObservationByKey({ ...o1, isSelected: false }, selectedFirstIndex, o.update);
  };

  const handleOnSplit = () => {
    const selectedCount = hForm.getValues().o.filter((obs) => obs.isSelected).length;

    for (let i = 0; i < selectedCount; i++) {
      const { o: all } = hForm.getValues();

      const toSplitIndex = all.findIndex((obs) => obs.isSelected && obs.resources.length > 1);

      if (toSplitIndex > -1) {
        const currentObservation = all[toSplitIndex];

        for (const [resourceIndex, resource] of currentObservation.resources.entries()) {
          updateObservationByKey(
            { ...currentObservation, resources: [resource], isSelected: false },
            toSplitIndex,
            resourceIndex === 0 ? o.update : o.insert
          );
        }
      }
    }
  };

  // when resource(s) gets imported from media picker
  // this will inject them to hookform array
  useListener(
    async (_resources) => {
      if (SITE_CONFIG.OBSERVATION.PREDICT.ACTIVE) {
        toastIdRef.current = toast({
          ...DEFAULT_TOAST.LOADING,
          description: t("form:uploader.predicting")
        });
      }

      const finalResources = await preProcessObservations(
        _resources,
        currentGroup,
        sortedCFList,
        speciesGroups,
        user.id
      );
      o.append(finalResources);

      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          ...DEFAULT_TOAST.SUCCESS,
          description: t("common:success")
        });
        setTimeout(() => toast.close(toastIdRef.current), 1000);
      }
    },
    [OBSERVATION_IMPORT_RESOURCE]
  );

  useListener(
    (o) => {
      setUploadSummery((_draft) => {
        _draft.data.push(o);
      });
    },
    [SYNC_SINGLE_OBSERVATION_DONE, SYNC_SINGLE_OBSERVATION_ERROR]
  );

  useListener(
    ({ data, applyIndex }) => {
      const { o: all } = hForm.getValues();

      if (typeof applyIndex === "number") {
        o.update(applyIndex, prepareObservationData(data));
      } else {
        const newValues = all.map((_o) =>
          _o.isSelected ? prepareObservationData({ ..._o, ...data, isSelected: false }) : _o
        );
        o.replace(newValues);
      }
    },
    [OBSERVATION_BULK_EDIT_DONE]
  );

  const handleOnSubmit = async ({ o }) => {
    const observations = o.map((observation) =>
      handleOnSingleObservationSubmit(
        observation,
        { languageId, fields: [], currentGroupId: currentGroup.id },
        false
      )
    );

    emit(SYNC_OBSERVATION, observations);

    setUploadSummery((_draft) => {
      _draft.payload = o;
      _draft.isSubmittd = true;
    });
  };

  return uploadSummery.isSubmittd ? (
    <UploadProgress {...uploadSummery} />
  ) : (
    <>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)} noValidate>
          <Box className="container-fluid" minH="calc(100vh - var(--heading-height))">
            <ImageGrid fields={o.fields} onRemove={o.remove} onBrowse={onBrowse} />
            <MediaPicker onBrowse={onBrowse} />
          </Box>
          <Toolbar
            onMerge={handleOnMerge}
            onSplit={handleOnSplit}
            onRemove={o.remove}
            onBrowse={onBrowse}
          />
        </form>
      </FormProvider>
      <BulkEditor />
      <ResourceImporter />
    </>
  );
}
