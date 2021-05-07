import SpeciesShowPageComponent from "@components/pages/species/show";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import {
  axCheckSpeciesPermission,
  axGetAllFieldsMeta,
  axGetAllTraitsMeta,
  axGetSpeciesById
} from "@services/species.service";
import { hasAccess } from "@utils/auth";
import { normalizeSpeciesPayload } from "@utils/species";
import React from "react";

import Error from "../../_error";

const SpeciesShowPage = ({ species, permissions, success }) => {
  return success ? (
    <SpeciesShowPageComponent species={species} permissions={permissions} />
  ) : (
    <Error statusCode={404} />
  );
};

export const getServerSideProps = async (ctx) => {
  const [
    traitsMeta,
    fieldsMeta,
    speciesData,
    speciesGroupsData,
    speciesPermission
  ] = await Promise.all([
    axGetAllTraitsMeta(),
    axGetAllFieldsMeta(),
    axGetSpeciesById(ctx.query.speciesId),
    axGetspeciesGroups(),
    axCheckSpeciesPermission(ctx, ctx.query.speciesId)
  ]);

  const species = normalizeSpeciesPayload(
    fieldsMeta.data,
    traitsMeta.data,
    speciesData.data,
    speciesGroupsData.data
  );

  const isAdmin = hasAccess([Role.Admin], ctx);

  return {
    props: {
      species,
      permissions: {
        isContributor: speciesPermission.data.isContributor || isAdmin,
        isFollower: speciesPermission.data.isFollower || null,
        isAdmin
      },
      success: speciesData.success
    }
  };
};

export default SpeciesShowPage;
