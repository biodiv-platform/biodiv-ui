import SITE_CONFIG from "@configs/site-config";
import { axPredictObservation } from "@services/api.service";
import { ACCEPTED_FILE_TYPES } from "@static/observation-create";
import { dateToUTC, formatDate } from "@utils/date";
import { resizePredictImage } from "@utils/image";
import { reverseGeocode } from "@utils/location";
import { getLocalIcon } from "@utils/media";
import { cleanFacts, cleanTags } from "@utils/tags";

import { parseDefaultCustomField } from "../create/form";
import { setLastData } from "../create/form/location/use-last-location";
import { getImageThumb } from "../create/form/uploader/observation-resources/resource-card";

const predictResource = async ({ resource, userId, speciesGroups }) => {
  try {
    let _thumbURL = getImageThumb(resource, userId);

    if (_thumbURL.startsWith("blob:")) {
      _thumbURL = await resizePredictImage(resource.blob);
    }

    const speciesGroupsMap = Object.fromEntries(speciesGroups.map((sg) => [sg.name, sg.id]));
    const _predictions = await axPredictObservation(_thumbURL);

    const sciNameOptions = _predictions.data.map((item) => ({
      isPrediction: true,
      label: item.speciesName,
      value: item.speciesName,
      groupId: speciesGroupsMap[item.speciesGroup],
      group: getLocalIcon(item.speciesGroup),
      status: "PREDICTION"
    }));

    return { sciNameOptions, sGroup: sciNameOptions?.[0]?.groupId };
  } catch (e) {
    console.error(e);
  }

  return {};
};

export const preProcessObservations = async (
  resourceGroups,
  currentGroup,
  customFieldList,
  speciesGroups,
  userId,
  canPredict
) => {
  const finalResources: any[] = [];

  const customFields = parseDefaultCustomField(customFieldList, currentGroup);

  for (const resources of resourceGroups) {
    let geoInfo = {};
    const r = resources[0];

    // If GPS is available then Reverse GeoCode given coordinates
    if (r.latitude) {
      try {
        const reverseGeoCoded = await reverseGeocode({ lat: r.latitude, lng: r.longitude });

        geoInfo = {
          latitude: r.latitude,
          longitude: r.longitude,
          observedAt: reverseGeoCoded?.[0]?.formatted_address
        };
      } catch (e) {
        console.error(e);
      }
    }

    let predictionResponse = {};

    const resourceTypeFileFormat = "." + r.type.substring(r.type.indexOf("/") + 1);

    if (
      canPredict &&
      SITE_CONFIG.OBSERVATION.PREDICT.ACTIVE &&
      r.blob &&
      ACCEPTED_FILE_TYPES["image/*"].includes(resourceTypeFileFormat)
    ) {
      predictionResponse = await predictResource({ resource: r, userId, speciesGroups });
    }

    finalResources.push({
      ...DEFAULT_OBSERVATION_PAYLOAD,
      ...predictionResponse,
      resources: resources,
      observedOn: r?.dateCreated ? new Date(r?.dateCreated).toISOString() : undefined,
      ...geoInfo,
      customFields,
      userGroupId: currentGroup.id && currentGroup.id > 0 ? [currentGroup.id.toString()] : []
    });
  }

  return finalResources;
};

export const prepareObservationData = (data) => ({
  ...data,
  observedOn: data.observedOn ? new Date(data.observedOn) : undefined,
  sGroup: data.sGroup ? Number(data.sGroup) : undefined,
  // assigns other values to `tmp`, since they need to be re-updated via `ref` for UI Components
  tmp: {
    sci: {
      value: data.scientificNameTaxonId,
      label: data.taxonScientificName,
      groupId: data.sGroup
    },
    com: { label: data.taxonCommonName, value: data.taxonCommonName }
  }
});

export const parseCustomFieldToPayload = (fields, customFields, userGroupId) => {
  if (!customFields) {
    return;
  }
  return fields.reduce((acc, { fieldType, customFieldId }, index) => {
    if (customFields[index]?.value) {
      let val;
      switch (fieldType) {
        case "MULTIPLE CATEGORICAL":
          val = { multipleCategorical: customFields[index]?.value };
          break;
        case "SINGLE CATEGORICAL":
          val = { singleCategorical: customFields[index]?.value };
          break;
        default:
          val = { textBoxValue: customFields[index]?.value };
          break;
      }
      acc.push({
        customFieldId,
        userGroupId,
        ...val
      });
    }
    return acc;
  }, []);
};

export const handleOnSingleObservationSubmit = (
  {
    taxonCommonName,
    scientificNameTaxonId,
    taxonScientificName,
    recoComment,
    confidence,
    languageId: lId,
    tags,
    customFields,
    facts,
    ...rest
  },
  { languageId, fields, currentGroupId },
  isSingle?
) => {

  console.log("before=",rest.observedOn)
  const observedOn = dateToUTC(formatDate(rest.observedOn)).format();
  console.log("after=",observedOn)

  const payload = {
    hidePreciseLocation: false,
    ...rest,
    ...cleanFacts(facts),
    resources: rest.resources.map((_r, idx) => ({
      ..._r,
      rating: rest.resources.length - idx
    })),
    observedOn,
    fromDate: observedOn,
    toDate: observedOn,
    reverseGeocoded: rest.observedAt,
    helpIdentify: !taxonCommonName && !taxonScientificName,
    recoData: {
      taxonCommonName,
      scientificNameTaxonId,
      taxonScientificName,
      recoComment,
      confidence,
      languageId: lId
    },
    tags: cleanTags(tags),
    protocol: isSingle ? "SINGLE_OBSERVATION" : "MULTI_OBSERVATION",
    obsvLanguageId: languageId,
    useDegMinSec: false,
    degMinSec: null
  };
  setLastData(rest.latitude, rest.longitude, rest.observedAt, fields, customFields);
  return {
    observation: {
      ...payload,
      customFieldList: parseCustomFieldToPayload(fields, customFields, currentGroupId)
    },
    instant: true,
    redirect: isSingle
  };
};

export const DEFAULT_OBSERVATION_PAYLOAD = {
  sGroup: undefined,
  helpIdentify: false,

  taxonCommonName: null,
  scientificNameTaxonId: null,
  taxonScientificName: null,
  recoComment: null,
  confidence: null,
  languageId: null,

  notes: null,
  tags: [],
  basisOfRecords: "HUMAN_OBSERVATION",

  dateAccuracy: "ACCURATE",
  observedAt: "",
  locationScale: "APPROXIMATE",
  latitude: 0,
  longitude: 0,
  hidePreciseLocation: false,

  facts: {},

  customFields: []
};
