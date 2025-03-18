import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import FlagActionButton from "@components/@core/action-buttons/flag";
import FollowActionButton from "@components/@core/action-buttons/follow";
import ShareActionButton from "@components/@core/action-buttons/share";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { useLocalRouter } from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { ShowDocument } from "@interfaces/document";
import {
  axDeleteDocument,
  axFlagDocument,
  axFollowDocument,
  axUnFlagDocument
} from "@services/document.service";
import { RESOURCE_SIZE } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

interface DocumentHeaderProps {
  document: ShowDocument;
}

export default function DocumentHeader({ document }: DocumentHeaderProps) {
  const [showActions, setShowActions] = useState<boolean>();
  const { isLoggedIn, user } = useGlobalState();
  const router = useLocalRouter();
  const documentId = document?.document?.id;

  const pageDescription = `${document?.document?.title} by ${document?.userIbp?.name}`;

  const { t, lang } = useTranslation();

  useEffect(() => {
    setShowActions(adminOrAuthor(document?.document?.authorId));
  }, [isLoggedIn]);

  const handleOnEdit = () => router.push(`/document/edit/${documentId}`, true);

  const ogImage = getResourceThumbnail(
    RESOURCE_CTX.DOCUMENT_SOCIAL_PREVIEW,
    document?.document?.documentSocialPreview,
    RESOURCE_SIZE.TWITTER
  );

  return (
    <>
      <NextSeo
        openGraph={{
          type: "website",
          locale: lang,
          url: SITE_CONFIG.SITE.URL + router.asPath,
          title: document?.document?.title,
          images: ogImage ? [{ url: ogImage }] : [{ url: "/next-assets/document-icon.svg" }],
          description: document?.document?.notes
        }}
        title={document?.document?.title}
        twitter={{
          site: SITE_CONFIG.SITE.URL,
          cardType: "summary_large_image"
        }}
      />
      <SimpleGrid columns={[1, 1, 4, 4]} mb={4} className="fadeInUp">
        <Box gridColumn="1 / 4">
          <Heading
            as="h1"
            size="lg"
            mb={2}
            dangerouslySetInnerHTML={{ __html: getInjectableHTML(document?.document?.title) }}
          />
        </Box>
        <Flex alignItems="top" justifyContent={["flex-start", "flex-end"]}>
          {showActions && (
            <SimpleActionButton
              icon={<EditIcon />}
              title={t("document:edit_document")}
              onClick={handleOnEdit}
              colorPalette="teal"
            />
          )}
          <FollowActionButton
            following={false}
            resourceId={documentId}
            toggleFollowFunc={axFollowDocument}
            followTitle={t("document:follow")}
            unFollowTitle={t("document:unfollow")}
          />
          <FlagActionButton
            resourceId={documentId}
            initialFlags={document?.flag}
            userId={user?.id}
            flagFunc={axFlagDocument}
            unFlagFunc={axUnFlagDocument}
          />
          {showActions && (
            <DeleteActionButton
              observationId={documentId}
              title={t("document:remove.title")}
              description={t("document:remove.description")}
              deleted={t("document:remove.success")}
              deleteFunc={axDeleteDocument}
            />
          )}
          <ShareActionButton text={pageDescription} title={t("document:share")} />
        </Flex>
      </SimpleGrid>
    </>
  );
}
