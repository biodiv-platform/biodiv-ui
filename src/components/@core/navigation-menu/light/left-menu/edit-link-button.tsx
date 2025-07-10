import { Button } from "@chakra-ui/react";
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
      axCheckUserGroupFounderOrAdmin(id).then((data) => {
        setCanEdit(data && !pathname.endsWith("edit"));
      });
    }
  }, [pathname]);

  return canEdit ? (
    <Button className="join-usergroup" m={2} colorPalette="blue" size="sm" asChild>
      <a href={`${webAddress}/edit`}>
        <EditIcon />
        {label}
      </a>
    </Button>
  ) : null;
}
