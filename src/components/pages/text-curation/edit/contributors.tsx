import { Avatar, AvatarGroup, Box, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import PeopleIcon from "@icons/people";
import { axUpdateContributors } from "@services/curate.service";
import { axUserFilterSearch } from "@services/user.service";
import { getUserImage } from "@utils/media";
import React, { useEffect, useState } from "react";

import ContributorsEditor from "./contributors-edit";

export default function Contributors({ type, ibpUsers, dataSheetId, isAdmin }) {
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
        <HStack mb={4}>
          <PeopleIcon />
          <Text>{type}</Text>
          <AvatarGroup size="sm" max={10}>
            {contributors?.map((u) => (
              <Avatar
                key={u.value}
                name={u.label}
                src={getUserImage(u.pic, u.name)}
                title={u.label}
              />
            ))}
          </AvatarGroup>
          {isAdmin && (
            <IconButton
              variant="link"
              colorScheme="blue"
              onClick={onToggle}
              aria-label="Edit"
              icon={<EditIcon />}
            />
          )}
        </HStack>
      )}
    </Box>
  );
}
