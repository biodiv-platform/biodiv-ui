import { Button } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { axCheckUserGroupFounderOrAdmin } from "@services/usergroup.service";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function EditLinkButton({ label }) {
  const {
    currentGroup: { webAddress, id }
  } = useGlobalState();
  const { pathname } = useRouter();

  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (id) {
      axCheckUserGroupFounderOrAdmin(id).then(({ data }) => {
        setCanEdit(data && !pathname.endsWith("edit"));
      });
    }
  }, [pathname]);

  return canEdit ? (
    <LocalLink href={`${webAddress}/edit`}>
      <Button className="join-usergroup" leftIcon={<EditIcon />} m={2} colorScheme="blue" size="sm">
        {label}
      </Button>
    </LocalLink>
  ) : null;
}
