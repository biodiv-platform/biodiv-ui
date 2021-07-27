import { Box, Heading, Skeleton, useRadioGroup } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import CustomRadio from "@components/pages/observation/create/form/groups/custom-radio";
import LifeListTable from "@components/pages/observation/list/views/stats/table";
import useUniqueSpecies from "@components/pages/observation/list/views/stats/use-unique-species";
import React, { useMemo, useState } from "react";

export const observationListParams = {
  geoShapeFilterField: "location"
};

export default function LandscapeObservationList({ sGroupList, title }) {
  const { speciesGroup, filter, location } = useObservationFilter();
  const [observationFilter, setFilter] = useState({ ...filter, sGroup: sGroupList[0] } || {});
  const uniqueSpecies = useUniqueSpecies({ filter: observationFilter, location });

  const speciesGroupList = useMemo(
    () =>
      speciesGroup
        ?.filter((o) => sGroupList.includes(o.id)) // removes All and non-specified from filter explicitly
        .sort((a, b) => (a?.order || 0) - (b.order || 0)),
    speciesGroup || []
  );

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "sGroup",
    defaultValue: sGroupList[0],
    onChange: (v) => setFilter({ ...observationFilter, sGroup: v && v !== "null" ? v : undefined })
  });

  return (
    <Box m={4}>
      <Heading mb={3} size="md">
        {title}
      </Heading>
      <Box p={4} className="white-box">
        <Skeleton mt={4} isLoaded={speciesGroupList && speciesGroupList.length > 0} mb={2}>
          <Box {...getRootProps()} minH="3.75rem">
            {speciesGroupList?.map((o) => (
              <CustomRadio
                key={o.id}
                icon={o.name}
                {...getRadioProps({ value: o?.id })}
                sm={true}
              />
            ))}
          </Box>
        </Skeleton>
        <LifeListTable
          data={uniqueSpecies.speciesData.data}
          speciesGroups={speciesGroupList}
          group={observationFilter.sGroup}
          loadMoreUniqueSpecies={uniqueSpecies.speciesData.loadMore}
          filter={filter}
        />
      </Box>
    </Box>
  );
}
