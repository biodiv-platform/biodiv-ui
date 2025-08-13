import SpeciesShowPageComponent from "@components/pages/species/show";
import { Role } from "@interfaces/custom";
import { axGroupList } from "@services/app.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import {
  axCheckSpeciesPermission,
  axGetAllFieldsMeta,
  axGetAllTraitsMetaByTaxonId,
  axGetSpeciesById
} from "@services/species.service";
import { hasAccess } from "@utils/auth";
import { absoluteUrl } from "@utils/basic";
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
  const currentLocaleId = getLanguageId(ctx.locale)?.ID;

  // const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
  //   ? currentLocaleId
  //   : SITE_CONFIG.LANG.DEFAULT_ID;

  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL, currentLocaleId);

  const [fieldsMeta, speciesData, speciesGroupsData, speciesPermission, licensesList] =
    await Promise.all([
      axGetAllFieldsMeta({ langId: currentLocaleId, userGroupId: currentGroup.groupId }),
      axGetSpeciesById(ctx.query.speciesId, currentGroup.groupId != null ? currentGroup : null),
      axGetspeciesGroups(),
      axCheckSpeciesPermission(ctx, ctx.query.speciesId),
      axGetLicenseList()
    ]);

  if (!speciesData.success) return { notFound: true };

  const traitsMeta = await axGetAllTraitsMetaByTaxonId(
    speciesData.data.species.taxonConceptId,
    getLanguageId(ctx.locale)?.ID
  );

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
