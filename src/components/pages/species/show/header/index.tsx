import { Box, Flex, HStack, Image, Spacer, Stack } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import FollowActionButton from "@components/@core/action-buttons/follow";
import ShareActionButton from "@components/@core/action-buttons/share";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { PageHeading } from "@components/@core/layout";
import ScientificName from "@components/@core/scientific-name";
import TaxonStatusBadge from "@components/pages/common/status-badge";
import { Role } from "@interfaces/custom";
import { axDeleteSpecies, axFollowSpecies } from "@services/species.service";
import { RESOURCE_SIZE } from "@static/constants";
import { SPECIES_NAME_PREFERRED_UPDATED } from "@static/events";
import { hasAccess } from "@utils/auth";
import { getLocalIcon, getResourceThumbnail } from "@utils/media";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";
import { useListener } from "react-gbus";
import { LuPencil } from "react-icons/lu";

import DownloadIcon from "@/icons/download";

import useSpecies from "../use-species";

function SpeciesHeader({ downloadSpecies }) {
  const { t } = useTranslation();
  const { species, permissions, taxonEditActions } = useSpecies();
  const speciesTitle = [
    species.taxonomyDefinition?.name || t("common:unknown"),
    t("header:menu_secondary.species.title")
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

  const canEditTaxon = hasAccess([Role.Admin, Role.SpeciesAdmin]);
  const currentTaxonId = species?.taxonomyDefinition?.id;

  const PageActions = () => (
    <div>
      <FollowActionButton
        following={permissions.isFollower}
        resourceId={species.species?.id}
        toggleFollowFunc={axFollowSpecies}
        followTitle={t("species:follow_species")}
        unFollowTitle={t("species:unfollow_species")}
      />
      {permissions.isContributor && (
        <DeleteActionButton
          observationId={species.species?.id}
          title={t("species:remove.title")}
          description={t("species:remove.description")}
          deleted={t("species:remove.success")}
          deleteFunc={axDeleteSpecies}
        />
      )}
      <ShareActionButton text={openGraph.title} title={t("species:share")} />
      <SimpleActionButton
        icon={<DownloadIcon />}
        title={t("species:download")}
        colorPalette="blue"
        onClick={downloadSpecies}
      />
    </div>
  );

  return (
    <Flex direction="column" bg="gray.300" borderRadius="md" p={4} mb={4}>
      <NextSeo openGraph={openGraph} title={openGraph.title} />
      <Spacer />
      <Stack direction="column" p={3} gap={4}>
        <PageHeading className="fadeInUp" mb={0} size="4xl">
          <HStack>
            <ScientificName value={species?.taxonomyDefinition?.italicisedForm} />
            {canEditTaxon && currentTaxonId && (
              <SimpleActionButton
                icon={<LuPencil />}
                title="Edit Taxon"
                onClick={taxonEditActions?.onOpen}
                colorPalette="green"
              />
            )}
          </HStack>
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

        <Box>
          <Image
            boxSize="5rem"
            m={-2}
            src={getLocalIcon(species.speciesGroup?.name)}
            title={species.speciesGroup?.name}
          />
        </Box>

        <PageActions />
      </Stack>
    </Flex>
  );
}

export default SpeciesHeader;
