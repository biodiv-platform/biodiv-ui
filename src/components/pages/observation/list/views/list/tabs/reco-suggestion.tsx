import BoxHeading from "@components/@core/layout/box-heading";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import AddSuggestion from "@components/pages/observation/show/suggestion/add-suggestion";
import RecoSuggestion from "@components/pages/observation/show/suggestion/reco-suggestion";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function RecoSuggestionTab({ o, recoUpdated }) {
  const { observationData } = useObservationFilter();
  const { t } = useTranslation();

  console.log("o=", o);

  return (
    <>
      <BoxHeading>🆔 {t("observation:id.title")}</BoxHeading>
      <RecoSuggestion
        observationId={o.observationId}
        isLocked={o.recoShow.isLocked}
        recoIbp={o.recoShow.recoIbp}
        allRecoVotes={o.recoShow.allRecoVotes}
        recoUpdated={recoUpdated}
        permissionOverride={observationData?.mvp[o.observationId]}
      />
      <AddSuggestion
        recoUpdated={recoUpdated}
        recoVotesLength={o.recoShow.allRecoVotes?.length}
        observationId={o.observationId}
        isLocked={o.recoShow.isLocked}
        sgroupId={o.speciesGroupId}
      />
    </>
  );
}
