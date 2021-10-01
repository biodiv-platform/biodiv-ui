import SpeciesShowPageComponent from "@components/pages/species/show";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import {
  axCheckSpeciesPermission,
  axGetAllFieldsMeta,
  axGetAllTraitsMetaByTaxonId,
  axGetSpeciesById
} from "@services/species.service";
import { hasAccess } from "@utils/auth";
import { normalizeSpeciesPayload } from "@utils/species";
import React from "react";

import Error from "../../_error";

const SpeciesShowPage = ({ species, licensesList, permissions, success }) => {
  return success ? (
    <SpeciesShowPageComponent
      species={species}
      permissions={permissions}
      licensesList={licensesList}
    />
  ) : (
    <Error statusCode={404} />
  );
};

export const getServerSideProps = async (ctx) => {
  const [fieldsMeta, speciesData, speciesGroupsData, speciesPermission, licensesList] =
    await Promise.all([
      axGetAllFieldsMeta(),
      axGetSpeciesById(ctx.query.speciesId),
      axGetspeciesGroups(),
      axCheckSpeciesPermission(ctx, ctx.query.speciesId),
      axGetLicenseList()
    ]);

  const traitsMeta = await axGetAllTraitsMetaByTaxonId(speciesData.data.species.taxonConceptId);

  const species = normalizeSpeciesPayload(
    fieldsMeta.data,
    traitsMeta.data,
    speciesData.data,
    speciesGroupsData.data
  );

  const isAdmin = hasAccess([Role.Admin], ctx);

  return {
    props: {
      licensesList: licensesList.data,
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
