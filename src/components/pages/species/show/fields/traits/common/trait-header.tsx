import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Heading, IconButton } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import EditIcon from "@icons/edit";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpecies from "../../../use-species";

export function TraitHeader({ trait, onOpen }) {
  const { t } = useTranslation();
  const { permissions } = useSpecies();

  return (
    <Heading as="h4" size="sm" mb={2} alignItems="center" display="flex">
      <LocalLink href={`/traits/show/${trait?.traitId}`} prefixGroup={true}>
        <BlueLink mr={2}>
          {trait?.name} {trait?.units && `(${trait.units})`}
        </BlueLink>
      </LocalLink>

      {trait?.description && (
        <Tooltip hasArrow={true} title={trait?.description}>
          <InfoOutlineIcon />
        </Tooltip>
      )}

      {onOpen && permissions.isContributor && (
        <Tooltip hasArrow={true} title={t("common:edit")}>
          <IconButton
            variant="link"
            colorScheme="blue"
            icon={<EditIcon />}
            aria-label={t("common:edit")}
            onClick={onOpen}
          />
        </Tooltip>
      )}
    </Heading>
  );
}
