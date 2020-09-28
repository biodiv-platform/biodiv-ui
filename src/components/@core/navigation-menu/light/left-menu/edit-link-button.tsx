import { Button } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function EditLinkButton({ label }) {
  const {
    currentGroup: { webAddress, id }
  } = useGlobalState();
  const { pathname } = useRouter();

  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    setCanEdit(hasAccess([Role.Admin, Role.UsergroupFounder]) && id && !pathname.endsWith("edit"));
  }, [pathname]);

  return canEdit ? (
    <LocalLink href={`${webAddress}/edit`}>
      <Button className="join-usergroup" leftIcon={<EditIcon />} m={2} colorScheme="blue" size="sm">
        {label}
      </Button>
    </LocalLink>
  ) : null;
}
