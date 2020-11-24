import { AddIcon } from "@chakra-ui/icons";
import { Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import ShareActionButton from "@components/@core/action-buttons/share";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import EditIcon from "@icons/edit";
import { axDeletePageByID } from "@services/pages.service";
import { NextSeo } from "next-seo";
import React from "react";

import usePagesSidebar from "../common/sidebar/use-pages-sidebar";

export default function PageHeader({ title, pageId }) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { canEdit } = usePagesSidebar();

  const handleOnEdit = () => router.push(`/page/edit/${pageId}`, true);

  const handleOnCreate = () => router.push(`/page/create`, true);

  return (
    <>
      <NextSeo openGraph={{ title }} title={title} />
      <SimpleGrid columns={{ base: 1, md: 4 }} mb={4} className="fadeInUp">
        <Heading as="h1" size="xl" mb={2} gridColumn="1 / 4">
          {title}
        </Heading>
        <Flex alignItems="top" justifyContent={["flex-start", "flex-end"]}>
          <ShareActionButton text={title} title={t("PAGE.SHARE")} />
          {canEdit && (
            <>
              <SimpleActionButton
                icon={<AddIcon />}
                title={t("PAGE.CREATE.TITLE")}
                onClick={handleOnCreate}
                colorScheme="yellow"
              />
              <SimpleActionButton
                icon={<EditIcon />}
                title={t("EDIT")}
                onClick={handleOnEdit}
                colorScheme="teal"
              />
              <DeleteActionButton
                observationId={pageId}
                title={t("PAGE.REMOVE.TITLE")}
                description={t("PAGE.REMOVE.DESCRIPTION")}
                deleted={t("PAGE.REMOVE.SUCCESS")}
                deleteFunc={axDeletePageByID}
              />
            </>
          )}
        </Flex>
      </SimpleGrid>
    </>
  );
}
