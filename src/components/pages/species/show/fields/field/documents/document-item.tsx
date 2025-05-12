import { Box, Heading, HStack, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import DocumentIcon from "@components/pages/document/common/document-icon";
import useGlobalState from "@hooks/use-global-state";
import { getUserImage } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Avatar } from "@/components/ui/avatar";

export default function DocumentItem({ document: d }) {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();

  return (
    <Box p={3} mt={4} borderWidth="1px" borderColor="gray.300" borderRadius="md">
      <LocalLink href={`/document/show/${d.id}`}>
        <HStack alignItems="center" gap={4} mb={4}>
          <DocumentIcon />
          <Heading fontSize="lg" className="elipsis-2">
            <span
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(d?.title || t("document:unknown"))
              }}
            />
          </Heading>
        </HStack>
      </LocalLink>

      <Link href={`${currentGroup?.webAddress}/user/show/${d.author?.id}`}>
        <Avatar
          mr={2}
          size="xs"
          name={d.author?.name}
          src={getUserImage(d.author?.profilePic, d.author?.name)}
        />
        {d.author?.name}
      </Link>
    </Box>
  );
}
