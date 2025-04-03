import { Box, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import PeopleIcon from "@icons/people";
import { axUpdateContributors } from "@services/curate.service";
import { axUserFilterSearch } from "@services/user.service";
import { getUserImage } from "@utils/media";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarGroup } from "@/components/ui/avatar";

import ContributorsEditor from "./contributors-edit";

export default function Contributors({ type, ibpUsers, dataSheetId, isAdmin }) {
  const { open, onToggle, onClose } = useDisclosure();
  const [contributors, setContributors] = useState(ibpUsers);
  useEffect(() => {
    setContributors(ibpUsers);
  }, [ibpUsers]);

  return (
    <Box>
      {open ? (
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
          <PeopleIcon size={"sm"} />
          <Text>{type}</Text>
          {/* max={10} */}
          <AvatarGroup size="sm">
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
            <IconButton variant="plain" colorPalette="blue" onClick={onToggle} aria-label="Edit">
              <EditIcon />
            </IconButton>
          )}
        </HStack>
      )}
    </Box>
  );
}
