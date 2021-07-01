import { Spinner } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import TraitsList from "@components/pages/observation/show/traits/traits-list";
import { axGetTraitsByGroupId } from "@services/observation.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

export default function TraitsTab({ o }) {
  const [traits, setTraits] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    axGetTraitsByGroupId(o.speciesGroupId).then(({ data }) => setTraits(data));
  }, []);

  return (
    <>
      <BoxHeading>💎 {t("observation:traits")}</BoxHeading>
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
