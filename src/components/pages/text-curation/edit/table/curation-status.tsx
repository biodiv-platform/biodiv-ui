import { TimeIcon } from "@chakra-ui/icons";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useCurateEdit from "../use-curate-edit";

export default function CurationStatus({ row, name }) {
  const { rows } = useCurateEdit();
  const { t } = useTranslation();

  const onUpdateStatus = (status) => rows.update({ ...row, [name]: status });

  return (
    <div>
      <ButtonGroup size="sm" isAttached={true}>
        <IconButton
          colorScheme={row.curatedStatus === "CURATED" ? "green" : undefined}
          icon={<CheckIcon />}
          aria-label={t("text-curation:curation_status.curated")}
          onClick={() => onUpdateStatus("CURATED")}
        />
        <IconButton
          colorScheme={row.curatedStatus === "REJECTED" ? "red" : undefined}
          icon={<CrossIcon />}
          aria-label={t("text-curation:curation_status.rejected")}
          onClick={() => onUpdateStatus("REJECTED")}
        />
        <IconButton
          colorScheme={row.curatedStatus === "PENDING" ? "orange" : undefined}
          icon={<TimeIcon />}
          aria-label={t("text-curation:curation_status.pending")}
          onClick={() => onUpdateStatus("PENDING")}
        />
      </ButtonGroup>
    </div>
  );
}
