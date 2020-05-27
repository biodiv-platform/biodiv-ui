import BoxHeading from "@components/@core/layout/box-heading";
import TraitsList from "@components/pages/observation/show/traits/traits-list";
import useTranslation from "@configs/i18n/useTranslation";
import { axGetTraitsByGroupId } from "@services/observation.service";
import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/core";

export default function TraitsTab({ o }) {
  const [traits, setTraits] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    axGetTraitsByGroupId(o.speciesGroupId).then(({ data }) => setTraits(data));
  }, []);

  return (
    <>
      <BoxHeading>💎 {t("OBSERVATION.TRAITS")}</BoxHeading>
      {traits ? (
        <TraitsList
          factsList={o.factValuePair}
          speciesTraitsListDefault={traits}
          observationId={o.observationId}
          authorId={o.user.id}
        />
      ) : (
        <Spinner m={4} />
      )}
    </>
  );
}
