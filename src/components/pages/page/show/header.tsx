import { Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import ShareActionButton from "@components/@core/action-buttons/share";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import EditIcon from "@icons/edit";
import { Role } from "@interfaces/custom";
import { axDeletePageByID } from "@services/pages.service";
import { hasAccess } from "@utils/auth";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

export default function PageHeader({ title, pageId }) {
  const { t } = useTranslation();
  const router = useLocalRouter();

  const showActions = useMemo(() => hasAccess([Role.Admin]), []);

  const handleOnEdit = () => router.push(`/page/edit/${pageId}`, true);

  return (
    <>
      <NextSeo openGraph={{ title }} title={title} />
      <SimpleGrid columns={{ base: 1, md: 4 }} mb={4} className="fadeInUp">
        <Heading as="h1" size="xl" mb={2} gridColumn="1 / 4">
          {title}
        </Heading>
        <Flex alignItems="top" justifyContent={["flex-start", "flex-end"]}>
          <ShareActionButton text={title} title={t("PAGE.SHARE")} />
          {showActions && (
            <>
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
