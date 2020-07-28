import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/core";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import FlagActionButton from "@components/@core/action-buttons/flag";
import FollowActionButton from "@components/@core/action-buttons/follow";
import ShareActionButton from "@components/@core/action-buttons/share";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import { ShowDocument } from "@interfaces/document";
import {
  axDeleteDocument,
  axFlagDocument,
  axFollowDocument,
  axUnFlagDocument
} from "@services/document.service";
import { adminOrAuthor } from "@utils/auth";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

interface DocumentHeaderProps {
  document: ShowDocument;
}

export default function DocumentHeader({ document }: DocumentHeaderProps) {
  const [showActions, setShowActions] = useState<boolean>();
  const { isLoggedIn, user } = useStoreState((s) => s);
  const router = useLocalRouter();
  const documentId = document?.document?.id;

  const pageDescription = `${document?.document?.title} by ${document?.userIbp?.name}`;

  const { t } = useTranslation();

  useEffect(() => {
    setShowActions(adminOrAuthor(document.document.authorId));
  }, [isLoggedIn]);

  const setFlags = (flags) => {
    console.debug(flags);
    // TODO: update to tree root
    // setDocument((draft: ShowDocument) => {
    //   draft.flag = flags;
    // });
  };

  const handleOnEdit = () => router.push(`/document/edit/${documentId}`, true);

  return (
    <SimpleGrid columns={[1, 1, 4, 4]} mb={4} className="fadeInUp">
      <Box gridColumn="1 / 4">
        <Heading as="h1" size="xl" mb={2}>
          {document?.document?.title}
        </Heading>
      </Box>
      <Flex alignItems="top" justifyContent={["flex-start", "flex-end"]}>
        {showActions && (
          <SimpleActionButton
            icon="edit"
            title={t("DOCUMENT.EDIT_DOCUMENT")}
            onClick={handleOnEdit}
            variantColor="teal"
          />
        )}
        <FollowActionButton
          following={false}
          resourceId={documentId}
          toggleFollowFunc={axFollowDocument}
          followTitle={t("DOCUMENT.FOLLOW")}
          unFollowTitle={t("DOCUMENT.UNFOLLOW")}
        />
        <FlagActionButton
          resourceId={documentId}
          flags={document?.flag}
          setFlags={setFlags}
          userId={user.id}
          flagFunc={axFlagDocument}
          unFlagFunc={axUnFlagDocument}
        />
        {showActions && (
          <DeleteActionButton
            observationId={documentId}
            title={t("DOCUMENT.REMOVE.TITLE")}
            description={t("DOCUMENT.REMOVE.DESCRIPTION")}
            deleted={t("DOCUMENT.REMOVE.SUCCESS")}
            deleteFunc={axDeleteDocument}
          />
        )}
        <ShareActionButton text={pageDescription} title={t("DOCUMENT.SHARE")} />
      </Flex>
    </SimpleGrid>
  );
}
