import { authorizedPageSSP } from "@components/auth/auth-redirect";
import TraitsBatchUploadComponent from "@components/pages/traits/batch-upload";
import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { axGetAllTraitsMeta } from "@services/species.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const TraitsBatchUpload = ({ traits }) => <TraitsBatchUploadComponent traits={traits} />;

export const getServerSideProps = async (ctx) => {
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  const redirect = authorizedPageSSP([Role.Any], ctx);
  const { data: traits } = await axGetAllTraitsMeta(langId);
  return redirect || { props: { traits } };
};

export default TraitsBatchUpload;
