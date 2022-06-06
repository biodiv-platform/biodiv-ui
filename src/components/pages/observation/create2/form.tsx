import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import {
  OBSERVATION_BULK_EDIT_DONE,
  OBSERVATION_IMPORT_RESOURCE,
  SYNC_SINGLE_OBSERVATION_DONE,
  SYNC_SINGLE_OBSERVATION_ERROR
} from "@static/events";
import deepmerge from "deepmerge";
import React from "react";
import { useListener } from "react-gbus";
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
import Toolbar from "./toolbar";
import UploadProgress from "./upload-progress";

const deepMergeObservations = (prev, current) => {
  const _prev = Object.fromEntries(Object.entries(prev).filter((o) => o[1]));
  const _current = Object.fromEntries(Object.entries(current).filter((o) => o[1]));
  return deepmerge(_prev, _current);
};

export default function ObservationCreate2Form({ onBrowse }) {
  const { currentGroup, languageId } = useGlobalState();

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
              resources: Yup.array().min(1).required(),

              //custom field data
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
  const updateObservationByIndex = (data, index, callback) => {
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

    updateObservationByIndex({ ...o1, isSelected: false }, selectedFirstIndex, o.update);
  };

  const handleOnSplit = () => {
    const selectedCount = hForm.getValues().o.filter((obs) => obs.isSelected).length;

    for (let i = 0; i < selectedCount; i++) {
      const { o: all } = hForm.getValues();

      const toSplitIndex = all.findIndex((obs) => obs.isSelected && obs.resources.length > 1);

      if (toSplitIndex > -1) {
        const currentObservation = all[toSplitIndex];

        for (const [resourceIndex, resource] of currentObservation.resources.entries()) {
          updateObservationByIndex(
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
      const finalResources = await preProcessObservations(_resources, currentGroup);
      o.append(finalResources);
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
    (data) => {
      const { o: all } = hForm.getValues();

      for (let i = 0; i < all.length; i++) {
        if (all[i].isSelected) {
          o.update(i, prepareObservationData({ ...all[i], ...data }));
        }
      }
    },
    [OBSERVATION_BULK_EDIT_DONE]
  );

  const handleOnSubmit = async ({ o }) => {
    for (const observation of o) {
      await handleOnSingleObservationSubmit(
        observation,
        {
          languageId,
          fields: [],
          currentGroupId: currentGroup.id
        },
        false
      );
    }
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
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <Toolbar onMerge={handleOnMerge} onSplit={handleOnSplit} onRemove={o.remove} />
          <div className="container-fluid">
            <ImageGrid fields={o.fields} onRemove={o.remove} onBrowse={onBrowse} />
            <MediaPicker onBrowse={onBrowse} />
          </div>
        </form>
      </FormProvider>
      <BulkEditor />
    </>
  );
}
