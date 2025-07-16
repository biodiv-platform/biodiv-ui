import { Button, ButtonGroup } from "@chakra-ui/react";
import CheckBoxItems from "@components/pages/group/common/icon-checkbox-field/checkbox";
import styled from "@emotion/styled";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

const EditContainer = styled.div`
  padding: 1rem;

  .cb-items {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 1rem;

    label {
      margin: 0 auto;
    }
  }
`;

export default function CoverageEdit({ value, onChange, items, type, onClose }) {
  const { t } = useTranslation();
  const [coverage, setCoverage] = useState(value);

  const onSave = () => onChange(coverage);

  return (
    <EditContainer>
      <CheckBoxItems options={items} defaultValue={value} onChange={setCoverage} type={type} />
      <ButtonGroup gap={4} mt={4}>
        <Button onClick={onSave} colorPalette="blue">
          {t("common:save")}
        </Button>
        <Button onClick={onClose} variant={"subtle"}>
          {t("common:cancel")}
        </Button>
      </ButtonGroup>
    </EditContainer>
  );
}
