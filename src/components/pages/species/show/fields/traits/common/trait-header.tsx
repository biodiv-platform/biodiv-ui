import { Heading, IconButton } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import EditIcon from "@icons/edit";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuInfo } from "react-icons/lu";

import useSpecies from "../../../use-species";

export function TraitHeader({ trait, onOpen }) {
  const { t } = useTranslation();
  const { permissions } = useSpecies();

  return (
    <Heading as="h4" size="sm" mb={2} alignItems="center" display="flex">
      <BlueLink mr={2} asChild>
        <LocalLink href={`/traits/show/${trait?.traitId}`} prefixGroup={true}>
          {trait?.name} {trait?.units && `(${trait.units})`}
        </LocalLink>
      </BlueLink>

      {trait?.description && (
        <Tooltip showArrow={true} title={trait?.description}>
          <LuInfo />
        </Tooltip>
      )}

      {onOpen && permissions.isContributor && (
        <Tooltip showArrow={true} title={t("common:edit")}>
          <IconButton
            variant="plain"
            colorPalette="blue"
            aria-label={t("common:edit")}
            onClick={onOpen}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </Heading>
  );
}
