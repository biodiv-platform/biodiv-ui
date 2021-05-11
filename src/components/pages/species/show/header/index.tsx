import { Box, Flex, Spacer, Stack } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import FollowActionButton from "@components/@core/action-buttons/follow";
import ShareActionButton from "@components/@core/action-buttons/share";
import { PageHeading } from "@components/@core/layout";
import TaxonStatusBadge from "@components/pages/common/status-badge";
import useTranslation from "@hooks/use-translation";
import { axDeleteSpecies, axFollowSpecies } from "@services/species.service";
import { RESOURCE_SIZE } from "@static/constants";
import { SPECIES_NAME_PREFERRED_UPDATED } from "@static/events";
import { getResourceThumbnail } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import { NextSeo } from "next-seo";
import React, { useMemo, useState } from "react";
import { useListener } from "react-gbus";

import useSpecies from "../use-species";

function SpeciesHeader() {
  const { t } = useTranslation();
  const { species, permissions } = useSpecies();
  const speciesTitle = [
    species.taxonomyDefinition?.normalizedForm || t("UNKNOWN"),
    t("HEADER.MENU_SECONDARY.SPECIES.TITLE")
  ].join(" | ");

  const [prefferedCommonName, setPrefferedCommonName] = useState(species?.prefferedCommonName);

  const openGraph = useMemo(
    () => ({
      title: speciesTitle,
      description: speciesTitle,
      images: species?.resourceData?.map((r) => ({
        url: getResourceThumbnail(
          r?.resource?.context,
          r?.resource?.fileName,
          RESOURCE_SIZE.TWITTER
        )
      }))
    }),
    []
  );

  useListener(setPrefferedCommonName, [SPECIES_NAME_PREFERRED_UPDATED]);

  const PageActions = () => (
    <div>
      <FollowActionButton
        following={permissions.isFollower}
        resourceId={species.species?.id}
        toggleFollowFunc={axFollowSpecies}
        followTitle={t("SPECIES.FOLLOW_SPECIES")}
        unFollowTitle={t("SPECIES.UNFOLLOW_SPECIES")}
      />
      {permissions.isContributor && (
        <DeleteActionButton
          observationId={species.species?.id}
          title={t("SPECIES.REMOVE.TITLE")}
          description={t("SPECIES.REMOVE.DESCRIPTION")}
          deleted={t("SPECIES.REMOVE.SUCCESS")}
          deleteFunc={axDeleteSpecies}
        />
      )}
      <ShareActionButton text={openGraph.title} title={t("SPECIES.SHARE")} />
    </div>
  );

  return (
    <Flex direction="column" bg="gray.300" borderRadius="md" p={4} mb={4}>
      <NextSeo openGraph={openGraph} title={openGraph.title} />
      <Spacer />
      <Stack direction="column" p={3} spacing={4}>
        <PageHeading className="fadeInUp" mb={0}>
          <Box
            dangerouslySetInnerHTML={{
              __html: getInjectableHTML(species?.taxonomyDefinition?.italicisedForm)
            }}
          />
        </PageHeading>

        {prefferedCommonName && (
          <PageHeading size="md" fontWeight="normal" className="fadeInUp" mb={0}>
            {prefferedCommonName?.name}
          </PageHeading>
        )}

        <TaxonStatusBadge
          reco={species.taxonomyDefinition}
          crumbs={species.breadCrumbs}
          taxonId={species.taxonomyDefinition.id}
        />

        <PageActions />
      </Stack>
    </Flex>
  );
}

export default SpeciesHeader;
