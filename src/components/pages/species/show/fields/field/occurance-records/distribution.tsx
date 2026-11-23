import TemporalObservedOn from "@components/pages/observation/list/views/stats/temporal-observed-on";
import useGlobalState from "@hooks/use-global-state";
import { useMemo } from "react";
import { LuChartColumn, LuMap } from "react-icons/lu";

import useSpecies from "../../../use-species";
import OccuranceRecoardSpeciesField from ".";
import OccurrenceSection from "./occurrence-section";

interface OccurrenceDistributionProps {
  valueCallback: (loaded: boolean) => void;
  observationsMap;
  temporalObservedRef;
}

/** Occurrence records of a species: where (grid map) and when (month chart), IBP and GBIF */
export default function OccurrenceDistribution({
  valueCallback,
  observationsMap,
  temporalObservedRef
}: OccurrenceDistributionProps) {
  const { currentGroup } = useGlobalState();
  const { species } = useSpecies();

  const temporalFilter = useMemo(
    () => ({
      view: "stats",
      max: 8,
      offset: 0,
      userGroupList: currentGroup?.id || undefined,
      taxon: String(species.species.taxonConceptId),
      showData: "true"
    }),
    [currentGroup?.id, species.species.taxonConceptId]
  );

  return (
    <>
      <OccurrenceSection
        id="spatial-distribution"
        icon={<LuMap />}
        title="Spatial Distribution of Observations"
        description="Where this species has been recorded, based on observations from IBP and GBIF."
      >
        <OccuranceRecoardSpeciesField valueCallback={valueCallback} ref={observationsMap} />
      </OccurrenceSection>

      <OccurrenceSection
        id="temporal-distribution"
        icon={<LuChartColumn />}
        title="Temporal Distribution of Observations"
      >
        <TemporalObservedOn
          ref={temporalObservedRef}
          variant="section"
          showGBIF={true}
          description="When this species has been recorded, based on observation dates from IBP and GBIF."
          filter={temporalFilter}
        />
      </OccurrenceSection>
    </>
  );
}
