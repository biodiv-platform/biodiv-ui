import { Box, Button, CheckboxGroup, Collapse, Icon, useDisclosure } from "@chakra-ui/core";
import { axGetUserGroupList } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

import Checkbox from "./checkbox";

interface IUserGroupsProps {
  name: string;
  label: string;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
}

export default function UserGroups({ name, label, form }: IUserGroupsProps) {
  const [userGroups, setUserGroups] = useState([]);
  const { isOpen, onToggle } = useDisclosure();

  const initialValue = form.control.defaultValuesRef.current[name];

  useEffect(() => {
    axGetUserGroupList().then(({ data }) => setUserGroups(data || []));
  }, []);

  const onChange = (value) => {
    form.setValue(
      name,
      value.map((i) => Number(i))
    );
  };

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <Box>
      <Button variant="link" color="gray.900" fontSize="2xl" mb={2} onClick={onToggle}>
        👥 {label} <Icon name={isOpen ? "chevron-up" : "chevron-down"} />
      </Button>
      <Collapse isOpen={isOpen}>
        <CheckboxGroup
          defaultValue={initialValue}
          onChange={onChange}
          display="grid"
          className="custom-checkbox-group"
          gridGap={4}
          gridTemplateColumns={["repeat(1,1fr)", "repeat(1,1fr)", "repeat(3,1fr)", "repeat(5,1fr)"]}
        >
          {userGroups.map((o) => (
            <Checkbox key={o.id} value={o.id.toString()} label={o.name} icon={o.icon} />
          ))}
        </CheckboxGroup>
      </Collapse>
    </Box>
  );
}
