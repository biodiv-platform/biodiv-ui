import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import CustomFieldList from "@components/pages/observation/show/custom-fields/list";
import useTranslation from "@hooks/use-translation";
import useGlobalState from "@hooks/use-global-state";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { ObservationData } from "@interfaces/custom";
import { ObservationListPageMapper } from "@interfaces/observation";
import { axGetCustomFieldsPermissions } from "@services/observation.service";
import React, { useState } from "react";
import { useEffect } from "react";

interface ICustomFieldsTabInterface {
  o: ObservationListPageMapper;
}

export default function CustomFieldsTab({ o }: ICustomFieldsTabInterface) {
  const [cfPermission, setCfPermission] = useState();
  const { t } = useTranslation();
  const { setObservationData } = useObservationFilter();
  const { isLoggedIn } = useGlobalState();

  useEffect(() => {
    if (isLoggedIn) {
      const taxonIds = o.recoShow.allRecoVotes.map((rv) => rv.taxonId);
      axGetCustomFieldsPermissions(o.observationId, taxonIds).then(({ data }) => {
        setCfPermission(data.cfPermission);
      });
    }
  }, [isLoggedIn]);

  const onCFUpdate = (data) => {
    setObservationData((_draft: ObservationData) => {
      const obIndex = _draft.l.findIndex((ob) => ob.observationId === o.observationId);
      _draft.l[obIndex].customField = data;
    });
  };

  return (
    <>
      <BoxHeading>🔶 {t("OBSERVATION.CUSTOM_FIELDS")}</BoxHeading>
      {o.customField.length ? (
        <CustomFieldList
          o={o}
          setO={onCFUpdate}
          observationId={o.observationId}
          cfPermission={cfPermission}
        />
      ) : (
        <Box p={4}>{t("OBSERVATION.NO_CUSTOM_FIELD")}</Box>
      )}
    </>
  );
}
