import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { axGetUserGroupList } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import CheckBoxItems from "./checkbox";

interface IUserGroupsProps {
  name: string;
  label: string;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
}

export default function UserGroups({ name, label, form }: IUserGroupsProps) {
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    axGetUserGroupList().then(({ data }) => setUserGroups(data || []));
  }, []);

  return (
    <Box data-hidden={!SITE_CONFIG.USERGROUP.ACTIVE}>
      <Button variant="link" color="gray.900" fontSize="2xl" mb={2} onClick={onToggle}>
        👥 {label} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
      <Collapse in={isOpen}>
        <Controller
          control={form.control}
          name={name}
          defaultValue={form.control.defaultValuesRef.current[name]}
          render={({ onChange, value }) => (
            <CheckBoxItems options={userGroups} defaultValue={value} onChange={onChange} />
          )}
        />
      </Collapse>
    </Box>
  );
}
