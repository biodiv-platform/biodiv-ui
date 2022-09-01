import { Avatar, AvatarGroup, Box, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import PeopleIcon from "@icons/people";
import { axUpdateContributors } from "@services/curate.service";
import { axUserFilterSearch } from "@services/user.service";
import { getUserImage } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import React, { useEffect, useState } from "react";

import ContributorsEditor from "./contributors-edit";
interface MetaBlockProps {
  icon?;
  children?;
  isHtml?: boolean;
  tooltip?;
}

const MetaBlock = ({ icon, children, isHtml, tooltip }: MetaBlockProps) =>
  children ? (
    <HStack alignItems="center" spacing={2} title={tooltip}>
      {icon}
      {isHtml ? (
        <div
          className="elipsis"
          dangerouslySetInnerHTML={{ __html: getInjectableHTML(children) }}
        />
      ) : (
        <div className="elipsis" children={children} />
      )}
    </HStack>
  ) : null;

export default function Contributors({ type, ibpUsers, dataSheetId }) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [contributors, setContributors] = useState(ibpUsers);
  useEffect(() => {
    setContributors(ibpUsers);
  }, [ibpUsers]);

  return (
    <Box>
      {isOpen ? (
        <ContributorsEditor
          queryFunc={axUserFilterSearch}
          updateFunc={axUpdateContributors}
          onClose={onClose}
          contributors={contributors}
          setContributors={setContributors}
          dataSheetId={dataSheetId}
          type={type}
        />
      ) : (
        <HStack>
          <MetaBlock
            icon={<PeopleIcon />}
            tooltip={type} //{t("text-curation:list_page.curators")}
            isHtml={true}
            children={type} //{t("text-curation:list_page.curators")}
          />
          <AvatarGroup size="sm" max={10}>
            {ibpUsers?.map((u) => (
              <Avatar
                key={u.value}
                name={u.label}
                src={getUserImage(u.pic, u.name)}
                title={u.label}
              />
            ))}
          </AvatarGroup>
          <IconButton
            variant="link"
            colorScheme="blue"
            onClick={onToggle}
            aria-label="Edit"
            icon={<EditIcon />}
          />
        </HStack>
      )}
    </Box>
  );
}
