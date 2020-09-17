import { IconButton } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

const Ellipsis = styled.div`
  width: 30rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export default function ShowLess({ value }) {
  const handleClick = () => {
    notification(t("COPY"), NotificationType.Success);
    navigator.clipboard.writeText(value);
  };

  const { t } = useTranslation();
  return (
    <Ellipsis>
      <IconButton
        type="button"
        variant="link"
        icon="copy"
        aria-label={t("COPY")}
        onClick={handleClick}
      />
      {value}
    </Ellipsis>
  );
}
