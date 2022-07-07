import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { axGetUserGroupList } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import CheckBoxItems from "./checkbox";

interface IUserGroupsProps {
  name: string;
  label: string;
  mb?: number;
}

export default function UserGroups({ name, label }: IUserGroupsProps) {
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const { isOpen, onToggle } = useDisclosure();
  const { field } = useController({ name });

  useEffect(() => {
    axGetUserGroupList().then(({ data }) => setUserGroups(data || []));
  }, []);

  return (
    <Box data-hidden={!SITE_CONFIG.USERGROUP.ACTIVE}>
      <Button variant="link" color="gray.900" fontSize="2xl" mb={4} onClick={onToggle}>
        👥 {label} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
      <Collapse in={isOpen} unmountOnExit={true}>
        <CheckBoxItems options={userGroups} defaultValue={field.value} onChange={field.onChange} />
      </Collapse>
    </Box>
  );
}
