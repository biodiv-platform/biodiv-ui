import { authorizedPageSSR, throwUnauthorized } from "@components/auth/auth-redirect";
import ObservationEditComponent from "@components/pages/observation/edit";
import { Role } from "@interfaces/custom";
import { axGetObservationEditById } from "@services/observation.service";
import React from "react";

const ObservationEditPage = ({ observation, observationId }) => (
  <ObservationEditComponent observation={observation} observationId={observationId} />
);

ObservationEditPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx, true);
  const { success, data } = await axGetObservationEditById(ctx.query.observationId, ctx);
  if (success) {
    return {
      observation: data,
      observationId: ctx.query.observationId
    };
  } else {
    throwUnauthorized(ctx);
  }
};

export default ObservationEditPage;
