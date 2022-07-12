import { Box, Flex, Heading } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import FlagActionButton from "@components/@core/action-buttons/flag";
import FollowActionButton from "@components/@core/action-buttons/follow";
import ShareActionButton from "@components/@core/action-buttons/share";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import ScientificName from "@components/@core/scientific-name";
import TaxonBreadcrumbs from "@components/pages/common/breadcrumbs";
import TaxonStatusBadge from "@components/pages/common/status-badge";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { ShowData } from "@interfaces/observation";
import {
  axDeleteObservation,
  axFlagObservation,
  axFollowObservation,
  axUnFlagObservation
} from "@services/observation.service";
import { RESOURCE_SIZE } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { formatDateReadableFromUTC } from "@utils/date";
import { getResourceThumbnail } from "@utils/media";
import { stripTags } from "@utils/text";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";

interface IHeaderProps {
  o: ShowData;
  following?: boolean;
}

function Header({ o, following = false }: IHeaderProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isLoggedIn, user } = useGlobalState();
  const [showActions, setShowActions] = useState(false);

  const pageTitle = `${stripTags(o.recoIbp?.scientificName) || t("common:unknown")} by ${
    o.authorInfo?.name
  } on ${formatDateReadableFromUTC(o.observation?.fromDate)}`;

  const pageDescription = `${o.recoIbp?.scientificName || t("common:unknown")} Observed by ${
    o.authorInfo?.name
  } at ${o.observation?.placeName} on ${formatDateReadableFromUTC(o.observation?.fromDate)}`;

  const reprImage: any = useMemo(() => {
    if (o.observation?.reprImageId) {
      const r = o.observationResource?.find((i) => i.resource?.id === o.observation?.reprImageId);
      return getResourceThumbnail(
        r?.resource?.context,
        r?.resource?.fileName,
        RESOURCE_SIZE.TWITTER
      );
    }
  }, []);

  useEffect(() => {
    setShowActions(adminOrAuthor(o.authorInfo?.id));
  }, [isLoggedIn]);

  const handleOnEdit = () => router.push(`/observation/edit/${o.observation?.id}`, true);

  const PageActions = () => (
    <div>
      {showActions && (
        <SimpleActionButton
          icon={<EditIcon />}
          title={t("observation:edit_observation")}
          onClick={handleOnEdit}
          colorScheme="teal"
        />
      )}
      <FollowActionButton
        following={following}
        resourceId={o.observation?.id}
        toggleFollowFunc={axFollowObservation}
        followTitle={t("observation:follow_observation")}
        unFollowTitle={t("observation:unfollow_observation")}
      />
      <FlagActionButton
        resourceId={o.observation?.id}
        initialFlags={o.flag}
        userId={user?.id}
        flagFunc={axFlagObservation}
        unFlagFunc={axUnFlagObservation}
      />
      {showActions && (
        <DeleteActionButton
          observationId={o.observation?.id}
          title={t("observation:remove.title")}
          description={t("observation:remove.description")}
          deleted={t("observation:remove.success")}
          deleteFunc={axDeleteObservation}
        />
      )}
      <ShareActionButton text={pageDescription} title={t("observation:share")} />
    </div>
  );

  return (
    <>
      <NextSeo
        openGraph={{
          title: pageTitle,
          images: reprImage && [{ url: reprImage }],
          description: pageDescription
        }}
        title={pageTitle}
      />

      <PageHeading actions={<PageActions />}>
        <>
          <Flex direction={{ base: "column", md: "row" }}>
            <Box mr={2}>
              <ScientificName value={o.recoIbp?.scientificName || t("common:unknown")} />
            </Box>
            <TaxonStatusBadge
              reco={o.recoIbp}
              crumbs={o.recoIbp?.breadCrumbs}
              taxonId={o.recoIbp?.taxonId}
            />
          </Flex>
          {o.recoIbp?.commonName && (
            <Heading as="div" size="lg" mt={2}>
              {o.recoIbp?.commonName}
            </Heading>
          )}
        </>
      </PageHeading>
      <TaxonBreadcrumbs crumbs={o.recoIbp?.breadCrumbs} type="observation" />
    </>
  );
}

export default Header;
