import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import { ObservationUserPermission, ShowData } from "@interfaces/observation";
import { ACTIVITY_UPDATED } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit } from "react-gbus";
import LazyLoad from "react-lazyload";

import AddSuggestion from "./add-suggestion";
import RecoSuggestion from "./reco-suggestion";

interface ISuggestionListProps {
  o: ShowData;
  setO;
  permission?: ObservationUserPermission;
  images?;
}

export default function SuggesionList({ o, setO, permission }: ISuggestionListProps) {
  const { t } = useTranslation();

  const recoUpdated = (data) => {
    setO((draft: Required<ShowData>) => {
      draft.allRecoVotes = data.allRecoVotes;
      draft.recoIbp = data.recoIbp;
      draft.observation.isLocked = data.isLocked;
    });
    emit(ACTIVITY_UPDATED, o.observation?.id);
  };

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>🆔 {t("observation:id.title")}</BoxHeading>
      <RecoSuggestion
        observationId={o.observation?.id}
        isLocked={o.observation?.isLocked}
        recoIbp={o.recoIbp}
        allRecoVotes={o.allRecoVotes}
        recoUpdated={recoUpdated}
        permission={permission?.validatePermissionTaxon}
      />
      <LazyLoad once={true}>
        <AddSuggestion
          recoUpdated={recoUpdated}
          recoVotesLength={o.allRecoVotes?.length}
          observationId={o.observation?.id}
          isLocked={o.observation?.isLocked}
          images={o.observationResource}
        />
      </LazyLoad>
    </Box>
  );
}
