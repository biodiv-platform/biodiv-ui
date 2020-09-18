import { Box, Button, CheckboxGroup, Collapse, SimpleGrid, useDisclosure } from "@chakra-ui/core";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
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
        👥 {label} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
      <Collapse isOpen={isOpen}>
        <CheckboxGroup defaultValue={initialValue} onChange={onChange}>
          <SimpleGrid className="custom-checkbox-group" columns={[1, 1, 3, 5]} gridGap={4}>
            {userGroups.map((o) => (
              <Checkbox key={o.id} value={o.id.toString()} label={o.name} icon={o.icon} />
            ))}
          </SimpleGrid>
        </CheckboxGroup>
      </Collapse>
    </Box>
  );
}
