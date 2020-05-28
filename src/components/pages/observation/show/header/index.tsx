import { Box, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import { ShowData } from "@interfaces/observation";
import { RESOURCE_SIZE } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { formatDate } from "@utils/date";
import { getObservationImage } from "@utils/media";
import { useStoreState } from "easy-peasy";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";

import Breadcrumbs from "../breadcrumbs";
import ObservationStatusBadge from "../status-badge";
import DeleteObservation from "./delete";
import FollowObservation from "./follow";
import Share from "./share";
import SimpleButton from "./simple-button";

const FlagObservation = dynamic(() => import("./flag"), { ssr: false });

interface IHeaderProps {
  o: ShowData;
  setO;
  following?: boolean;
}

function Header({ o, setO, following = false }: IHeaderProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isLoggedIn, user, currentGroup } = useStoreState((s) => s);
  const [showActions, setShowActions] = useState(false);

  const pageTitle = `${o.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")} by ${
    o.authorInfo.name
  } on ${currentGroup.name}`;

  const pageDescription = `${o.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")} Observed by ${
    o.authorInfo.name
  } on ${formatDate(o.observation.fromDate)} at ${o.observation.placeName} on ${currentGroup.name}`;

  const reprImage: any = useMemo(() => {
    if (o.observation.reprImageId) {
      const r = o.observationResource.find((i) => i.resource.id === o.observation.reprImageId);
      return getObservationImage(r.resource.fileName, RESOURCE_SIZE.TWITTER);
    }
  }, []);

  useEffect(() => {
    setShowActions(adminOrAuthor(o.authorInfo.id));
  }, [isLoggedIn]);

  const setFlags = (flags) => {
    setO((draft: ShowData) => {
      draft.flag = flags;
    });
  };

  const handleOnEdit = () => router.push(`/observation/edit/${o.observation.id}`, true);

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
      <SimpleGrid columns={[1, 1, 4, 4]} mb={4} className="fadeInUp">
        <Box gridColumn="1 / 4">
          <Heading as="h1" size="xl" mb={2}>
            <Text as="i" mr={2}>
              {o.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}
            </Text>
            <ObservationStatusBadge
              reco={o.recoIbp}
              maxVotedRecoId={o.observation.maxVotedRecoId}
            />
          </Heading>
          {o.recoIbp?.commonName && (
            <Heading as="h2" size="lg">
              {o.recoIbp?.commonName}
            </Heading>
          )}
        </Box>
        <Flex alignItems="top" justifyContent={["flex-start", "flex-end"]}>
          {showActions && (
            <SimpleButton
              icon="edit"
              title="EDIT_OBSERVATION"
              onClick={handleOnEdit}
              variantColor="teal"
            />
          )}
          <FollowObservation following={following} observationId={o.observation.id} />
          <FlagObservation
            observationId={o.observation.id}
            flags={o.flag}
            setFlags={setFlags}
            userId={user.id}
          />
          {showActions && <DeleteObservation observationId={o.observation.id} />}
          <Share text={pageDescription} />
        </Flex>
      </SimpleGrid>
      <Breadcrumbs crumbs={o.recoIbp?.breadCrumbs} />
    </>
  );
}

export default Header;
