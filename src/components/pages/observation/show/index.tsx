import { Box, SimpleGrid } from "@chakra-ui/core";
import Carousel from "@components/@core/carousel";
import {
  ObservationUserPermission,
  ShowData,
  SpeciesGroup,
  TraitsValuePair
} from "@interfaces/observation";
import { axAddObservationComment } from "@services/activity.service";
import {
  axGetPermissions,
  axGroupsFeature,
  axGroupsUnFeature,
  axSaveUserGroups
} from "@services/observation.service";
import { RESOURCE_TYPE } from "@static/constants";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import { useImmer } from "use-immer";

import Activity from "./activity";
import CustomFields from "./custom-fields";
import Groups from "./groups";
import Header from "./header";
import Info from "./info";
import Sidebar from "./sidebar";
import LocationInformation from "./sidebar/location-info";
import Suggestions from "./sidebar/suggestions";
import Temporal from "./sidebar/temporal";
import RecoSuggestion from "./suggestion";
import TraitsPanel from "./traits";

interface IObservationShowPageComponentProps {
  observation: ShowData;
  traits: TraitsValuePair[];
  speciesGroups: SpeciesGroup[];
}

export default function ObservationShowPageComponent({
  observation,
  traits,
  speciesGroups
}: IObservationShowPageComponentProps) {
  const { isLoggedIn } = useStoreState((s) => s);
  const [o, setO] = useImmer<ShowData>(observation);
  const [permission, setPermission] = useState<ObservationUserPermission>();
  const [speciesGroup, setSpeciesGroup] = useState("");

  useEffect(() => {
    setSpeciesGroup(speciesGroups.find((sg) => sg.id === o.observation.groupId)?.name);
  }, [o.observation.groupId]);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        axGetPermissions(
          o.observation.id,
          o.allRecoVotes
            ?.map((o) => o.taxonId)
            .filter((o) => o)
            .toString()
        ).then(({ success, data }) => success && setPermission(data));
      }, 1000);
    }
  }, [isLoggedIn, o.allRecoVotes]);

  useEffect(() => {
    console.debug("observation", o, "permission", permission);
  }, [permission]);

  return (
    <div className="container mt">
      <Header o={o} following={permission?.following} />
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]}>
        <Box gridColumn="1/3" className="fadeInUp delay-3">
          <Carousel
            observationId={o.observation.id}
            resources={o.observationResource}
            reco={o.recoIbp}
            speciesGroup={speciesGroup}
          />
        </Box>
        <Box>
          <Sidebar
            observation={o.observation}
            authorInfo={o.authorInfo}
            speciesId={o.recoIbp?.speciesId}
          />
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]} className="fadeInUp delay-6">
        <Box gridColumn="1/3">
          <Info observation={o} speciesGroups={speciesGroups} />
          <RecoSuggestion o={o} setO={setO} permission={permission} />
          <CustomFields
            o={o}
            setO={setO}
            observationId={o.observation.id}
            cfPermission={permission?.cfPermission}
          />
          <TraitsPanel
            factsList={o.factValuePair}
            speciesTraitsListDefault={traits}
            observationId={o.observation.id}
            authorId={o.authorInfo.id}
          />
          <Groups
            resourceId={o.observation.id}
            observationGroups={o.userGroups}
            featured={o.fetaured}
            permission={permission}
            resourceType={RESOURCE_TYPE.OBSERVATION}
            saveUserGroupsFunc={axSaveUserGroups}
            featureFunc={axGroupsFeature}
            unfeatureFunc={axGroupsUnFeature}
          />
          <Activity
            resourceId={o.observation.id}
            resourceType={RESOURCE_TYPE.OBSERVATION}
            commentFunc={axAddObservationComment}
          />
        </Box>
        <Box>
          <LocationInformation
            layerInfo={o.layerInfo}
            latitude={o.observation.latitude}
            longitude={o.observation.longitude}
            geoprivacy={o.observation.geoPrivacy}
          />
          {o.esLayerInfo && (
            <>
              <Temporal data={o.esLayerInfo.monthAggregation} />
              <Suggestions
                title="OBSERVATION.RELATED"
                list={o.esLayerInfo.similarObservation}
                observationKey="reprImage"
                defaultSpeciesGroup={speciesGroup}
              />
            </>
          )}
          {o.observationNearBy && (
            <Suggestions
              title="OBSERVATION.NEARBY"
              list={o.observationNearBy}
              observationKey="thumbnail"
            />
          )}
        </Box>
      </SimpleGrid>
    </div>
  );
}
