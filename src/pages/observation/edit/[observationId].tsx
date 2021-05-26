import { authorizedPageSSR, throwUnauthorized } from "@components/auth/auth-redirect";
import ObservationEditComponent from "@components/pages/observation/edit";
import { Role } from "@interfaces/custom";
import { axGetObservationEditById } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import React from "react";

const ObservationEditPage = ({ observation, observationId, licensesList }) => (
  <ObservationEditComponent
    observation={observation}
    observationId={observationId}
    licensesList={licensesList}
  />
);

ObservationEditPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx, true);

  const { success, data } = await axGetObservationEditById(ctx.query.observationId, ctx);
  const { data: licensesList } = await axGetLicenseList();

  if (success) {
    return {
      licensesList,
      observation: data,
      observationId: ctx.query.observationId
    };
  } else {
    throwUnauthorized(ctx);
  }
};

export default ObservationEditPage;
