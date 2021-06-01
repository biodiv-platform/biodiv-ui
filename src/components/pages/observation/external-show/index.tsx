import { Box, SimpleGrid } from "@chakra-ui/react";
import CarouselObservation from "@components/@core/carousel";
import useGlobalState from "@hooks/use-global-state";
import {
  ObservationUserPermission,
  SpeciesGroup,
  ExternalShowData
} from "@interfaces/observation";
import { axGetPermissions } from "@services/observation.service";
import React, { useEffect, useState } from "react";
//import { useImmer } from "use-immer";

import Header from "@components/pages/observation/show/header";
import Info from "./info";
import Sidebar from "@components/pages/observation/show/sidebar";
import LocationInformation from "@components/pages/observation/show/sidebar/location-info";
import Suggestions from "@components/pages/observation/show/sidebar/suggestions";
import Temporal from "@components/pages/observation/show/sidebar/temporal";

interface IObservationShowPageComponentProps {
  observation: ExternalShowData;
  speciesGroups: SpeciesGroup[];
}

export default function ExternalObservationShowPageComponent({
  observation,
  speciesGroups
}: IObservationShowPageComponentProps) {
  const { isLoggedIn } = useGlobalState();
  //const [o, setO] = useImmer<ExternalShowData>(observation);
  const o = observation;
  const [permission, setPermission] = useState<ObservationUserPermission>();
  const [speciesGroup, setSpeciesGroup] = useState<any>("");

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
    <div className="container mt">
      <Header o={o} following={permission?.following} />
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]}>
        <Box gridColumn="1/3" className="fadeInUp delay-3">
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
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]} className="fadeInUp delay-6">
        <Box gridColumn="1/3">
          <Info observation={o} speciesGroups={speciesGroups} />
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
