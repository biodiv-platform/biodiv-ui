import { dateToUTC, formatDate } from "@utils/date";
import { reverseGeocode } from "@utils/location";
import { cleanFacts, cleanTags } from "@utils/tags";

import { setLastData } from "../create/form/location/use-last-location";

export const preProcessObservations = async (resources, currentGroup) => {
  const finalResources: any[] = [];

  for (const r of resources) {
    let geoInfo = {};

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

    finalResources.push({
      ...DEFAULT_OBSERVATION_PAYLOAD,
      resources: [r],
      observedOn: r.dateCreated,
      ...geoInfo,
      userGroupId: currentGroup.id && currentGroup.id > 0 ? [currentGroup.id.toString()] : []
    });
  }

  return finalResources;
};

export const prepareObservationData = (data) => ({
  ...data,
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
  redirect?
) => {
  const observedOn = dateToUTC(formatDate(rest.observedOn)).format();
  const payload = {
    hidePreciseLocation: false,
    ...rest,
    ...cleanFacts(facts),
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
    protocol: "SINGLE_OBSERVATION",
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
    redirect: redirect
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
