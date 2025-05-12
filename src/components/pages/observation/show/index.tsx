import { Box, SimpleGrid } from "@chakra-ui/react";
import CarouselObservation from "@components/@core/carousel";
import useObservationStatsData from "@components/pages/species/show/sidebar/use-observation-stats-data";
import useGlobalState from "@hooks/use-global-state";
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
import React, { useEffect, useState } from "react";
import { useImmer } from "use-immer";

import TemporalObservedOn from "../list/views/stats/temporal-observed-on";
import TraitsPerMonth from "../list/views/stats/traits-per-month";
import Activity from "./activity";
import CheckListAnnotation from "./checkListAnnotation";
import CustomFields from "./custom-fields";
import Groups from "./groups";
import Header from "./header";
import Info from "./info";
import Sidebar from "./sidebar";
import LocationInformation from "./sidebar/location-info";
import Suggestions from "./sidebar/suggestions";
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
  const { isLoggedIn } = useGlobalState();
  const [o, setO] = useImmer<ShowData>(observation);
  const [permission, setPermission] = useState<ObservationUserPermission>();
  const [speciesGroup, setSpeciesGroup] = useState<any>("");
  const statsData = useObservationStatsData(o.recoIbp?.taxonId);

  useEffect(() => {
    setSpeciesGroup(speciesGroups.find((sg) => sg.id === o.observation?.groupId)?.name || "");
  }, [o.observation?.groupId]);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        axGetPermissions(
          o.observation?.id,
          o.allRecoVotes
            ?.map((r) => r.taxonId)
            .filter((r) => r)
            .toString()
        ).then(({ success, data }) => success && setPermission(data));
      }, 1000);
    }
  }, [isLoggedIn, o.allRecoVotes]);

  useEffect(() => {
    console.debug("observation", o, "permission", permission);
  }, [permission]);

  return (
    <div className="container mt" key={o.observation?.id}>
      <Header o={o} following={permission?.following} />
      <SimpleGrid columns={[1, 1, 3, 3]} gap={[1, 1, 4, 4]}>
        <Box gridColumn="1/3">
          <CarouselObservation
            observationId={o.observation?.id}
            resources={o.observationResource || []}
            reco={o.recoIbp}
            speciesGroup={speciesGroup}
          />
        </Box>
        <Box>
          <Sidebar
            observation={o.observation}
            authorInfo={o.authorInfo}
            taxon={o.recoIbp?.taxonId}
          />
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 3, 3]} gap={[1, 1, 4, 4]}>
        <Box gridColumn="1/3">
          <Info observation={o} speciesGroups={speciesGroups} />
          <RecoSuggestion
            o={o}
            setO={setO}
            permission={permission}
            images={o.observationResource}
          />
          <CustomFields
            o={o}
            setO={setO}
            observationId={o.observation?.id}
            cfPermission={permission?.cfPermission}
          />
          <TraitsPanel
            factsList={o.factValuePair}
            speciesTraitsListDefault={traits}
            observationId={o.observation?.id}
            authorId={o.authorInfo?.id}
            groupId={o.observation?.groupId}
          />
          <Groups
            resourceId={o.observation?.id}
            observationGroups={o.userGroups}
            featured={o.fetaured}
            permission={permission}
            resourceType={RESOURCE_TYPE.OBSERVATION}
            saveUserGroupsFunc={axSaveUserGroups}
            featureFunc={axGroupsFeature}
            unfeatureFunc={axGroupsUnFeature}
          />
          {Object.keys(o?.checkListAnnotation || {}).length > 0 && (
            <CheckListAnnotation customData={o?.checkListAnnotation} />
          )}
          <Activity
            resourceId={o.observation?.id}
            resourceType={RESOURCE_TYPE.OBSERVATION}
            commentFunc={axAddObservationComment}
          />
        </Box>
        <Box>
          {o.layerInfo && (
            <LocationInformation
              layerInfo={o.layerInfo}
              latitude={o.observation?.latitude}
              longitude={o.observation?.longitude}
              geoprivacy={o.observation?.geoPrivacy}
            />
          )}
          {o.recoIbp?.taxonId && (
            <>
              <TemporalObservedOn
                data={statsData.data.list.groupObservedOn}
                isLoading={statsData.data.isLoading}
              />
              <TraitsPerMonth
                data={statsData.data.list.groupTraits}
                isLoading={statsData.data.isLoading}
              />
            </>
          )}
          {o.esLayerInfo && (
            <>
              <Suggestions
                title="observation:related"
                list={o.esLayerInfo.similarObservation}
                observationKey="reprImage"
                defaultSpeciesGroup={speciesGroup}
              />
            </>
          )}
          {o.observationNearBy && (
            <>
              <Suggestions
                title="observation:nearby"
                list={o.observationNearBy}
                observationKey="thumbnail"
              />
            </>
          )}
        </Box>
      </SimpleGrid>
    </div>
  );
}
