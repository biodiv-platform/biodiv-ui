import { Box, Button, Collapsible, Input, useDisclosure } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { axGetUserGroupList } from "@services/usergroup.service";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import CheckBoxItems from "./checkbox";

interface IUserGroupsProps {
  name: string;
  label: string;
  mb?: number;
}

export default function UserGroups({ name, label }: IUserGroupsProps) {
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const { open, onToggle } = useDisclosure();
  const { field } = useController({ name });
  const { t } = useTranslation();
  const [filterGroups, setFilterGroups] = useState<any[]>([]);

  const onQuery = debounce((e) => {
    setFilterGroups(
      userGroups?.filter((i) => i.name?.toLowerCase().match(e.target.value.toLowerCase()))
    );
  }, 200);

  useEffect(() => {
    axGetUserGroupList().then(({ data }) => {
      setUserGroups(data || []);
      setFilterGroups(data || []);
    });
  }, []);

  return (
    <Box data-hidden={!SITE_CONFIG.USERGROUP.ACTIVE}>
      <Button color="gray.900" fontSize="2xl" mb={4} onClick={onToggle} variant={"plain"}>
        👥 {label} {open ? <LuChevronUp /> : <LuChevronDown />}
      </Button>
      <Collapsible.Root open={open} >
        <Collapsible.Content>
          <Input mb={12} onChange={onQuery} placeholder={t("header:search")} />
          <CheckBoxItems
            options={filterGroups}
            defaultValue={field.value}
            onChange={field.onChange}
          />
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
