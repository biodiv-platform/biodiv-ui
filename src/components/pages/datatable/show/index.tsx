import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import Activity from "@components/pages/observation/show/activity";
import LocationInformation from "@components/pages/observation/show/sidebar/location-info";
import { axAddDataTableComment } from "@services/datatable.service";
import { RESOURCE_TYPE } from "@static/constants";
import React from "react";

import Group from "./group";
import Header from "./header";
import Info from "./info";
import ObservationsList from "./list";
import Sidebar from "./sidebar";

export default function DataTableShowPageComponent({
  datatableShow: { datatable, authorInfo, layerInfo },
  groups,
  speciesGroups
}) {
  return (
    <Box className="container mt" pb={6}>
      <Header datatable={datatable} authorName={authorInfo.name} />
      <ObservationsList dataTable={datatable} speciesGroups={speciesGroups} />
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]} className="fadeInUp delay-6">
        <Box gridColumn="1/3">
          <Stack>
            <Info dataTable={datatable} speciesGroups={speciesGroups} />
            <Group
              datatableId={datatable.id}
              groups={groups}
              defaultGroups={datatable?.userGroup?.map((item) => item.id) || []}
            />
            <Activity
              resourceId={datatable.id}
              resourceType={RESOURCE_TYPE.DATATABLE}
              commentFunc={axAddDataTableComment}
            />
          </Stack>
        </Box>
        <Box>
          <Stack>
            <Box>
              <Sidebar datatable={datatable} authorInfo={authorInfo} />
            </Box>
            {layerInfo && (
              <LocationInformation
                layerInfo={layerInfo}
                latitude={datatable?.geographicalCoverageLatitude}
                longitude={datatable?.geographicalCoverageLongitude}
                geoprivacy={datatable?.geographicalCoverageGeoPrivacy}
              />
            )}
          </Stack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
