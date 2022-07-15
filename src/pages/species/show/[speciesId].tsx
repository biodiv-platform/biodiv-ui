import SpeciesShowPageComponent from "@components/pages/species/show";
import SITE_CONFIG from "@configs/site-config";
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
import { getLanguageId } from "@utils/i18n";
import { normalizeSpeciesPayload } from "@utils/species";
import React from "react";

const SpeciesShowPage = ({ species, licensesList, permissions }) => (
  <SpeciesShowPageComponent
    species={species}
    permissions={permissions}
    licensesList={licensesList}
  />
);

export const getServerSideProps = async (ctx) => {
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;

  const [fieldsMeta, speciesData, speciesGroupsData, speciesPermission, licensesList] =
    await Promise.all([
      axGetAllFieldsMeta({ langId }),
      axGetSpeciesById(ctx.query.speciesId),
      axGetspeciesGroups(),
      axCheckSpeciesPermission(ctx, ctx.query.speciesId),
      axGetLicenseList()
    ]);

  if (!speciesData.success) return { notFound: true };

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
      }
    }
  };
};

export default SpeciesShowPage;
