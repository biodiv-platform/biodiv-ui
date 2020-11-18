import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import FlagActionButton from "@components/@core/action-buttons/flag";
import FollowActionButton from "@components/@core/action-buttons/follow";
import ShareActionButton from "@components/@core/action-buttons/share";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { ShowDocument } from "@interfaces/document";
import {
  axDeleteDocument,
  axFlagDocument,
  axFollowDocument,
  axUnFlagDocument
} from "@services/document.service";
import { adminOrAuthor } from "@utils/auth";
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

  const { t } = useTranslation();

  useEffect(() => {
    setShowActions(adminOrAuthor(document.document.authorId));
  }, [isLoggedIn]);

  const handleOnEdit = () => router.push(`/document/edit/${documentId}`, true);

  return (
    <SimpleGrid columns={[1, 1, 4, 4]} mb={4} className="fadeInUp">
      <Box gridColumn="1 / 4">
        <Heading as="h1" size="lg" mb={2}>
          {document?.document?.title}
        </Heading>
      </Box>
      <Flex alignItems="top" justifyContent={["flex-start", "flex-end"]}>
        {showActions && (
          <SimpleActionButton
            icon={<EditIcon />}
            title={t("DOCUMENT.EDIT_DOCUMENT")}
            onClick={handleOnEdit}
            colorScheme="teal"
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
          initialFlags={document?.flag}
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
