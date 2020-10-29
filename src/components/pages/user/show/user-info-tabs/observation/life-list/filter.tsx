import { Box, Checkbox, Skeleton, useRadioGroup } from "@chakra-ui/core";
import CustomRadio from "@components/pages/observation/create/form/groups/custom-radio";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function LifeListFilter({ filter, setFilter, speciesGroups }) {
  const { t } = useTranslation();

  const handleOnMediaChange = (e) => {
    setFilter({ ...filter, hasMedia: e.target.checked });
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "sGroup",
    value: filter?.sGroupId,
    onChange: (sGroupId) => setFilter({ ...filter, sGroupId })
  });

  return (
    <div>
      <Skeleton isLoaded={speciesGroups.length > 0} mb={2}>
        <Box {...getRootProps()} minH="3.75rem">
          {speciesGroups.map((o) => (
            <CustomRadio key={o.id} icon={o.name} {...getRadioProps({ value: o.id })} sm={true} />
          ))}
        </Box>
      </Skeleton>
      <Skeleton isLoaded={speciesGroups.length > 0} mb={4} maxW="8rem">
        <Checkbox defaultIsChecked={filter.hasMedia} onChange={handleOnMediaChange}>
          {t("USER.WITH_MEDIA")}
        </Checkbox>
      </Skeleton>
    </div>
  );
}
