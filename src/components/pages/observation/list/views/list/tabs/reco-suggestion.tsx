import BoxHeading from "@components/@core/layout/box-heading";
import RecoSuggestion from "@components/pages/observation/show/suggestion/reco-suggestion";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";
import AddSuggestion from "@components/pages/observation/show/suggestion/add-suggestion";

export default function RecoSuggestionTab({ o, recoUpdated, tabIndex }) {
  const { observationData } = useObservationFilter();
  const { t } = useTranslation();

  return tabIndex === 1 ? (
    <>
      <BoxHeading>🆔 {t("OBSERVATION.ID.TITLE")}</BoxHeading>
      <RecoSuggestion
        observationId={o.observationId}
        isLocked={o.recoShow.isLocked}
        recoIbp={o.recoShow.recoIbp}
        allRecoVotes={o.recoShow.allRecoVotes}
        recoUpdated={recoUpdated}
        permissionOverride={observationData.mvp[o.observationId]}
      />
      <AddSuggestion
        recoUpdated={recoUpdated}
        recoVotesLength={o.recoShow.allRecoVotes?.length}
        observationId={o.observationId}
        isLocked={o.recoShow.isLocked}
      />
    </>
  ) : null;
}
