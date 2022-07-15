import { Box, Checkbox, Skeleton, useRadioGroup } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import CustomRadio from "@components/pages/observation/create/form/groups/custom-radio";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SpeciesGroupFilter({ filter, setFilter, speciesGroups }) {
  const { t } = useTranslation();

  const handleOnMediaChange = (e) => {
    setFilter({ ...filter, hasMedia: e.target.checked });
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "sGroup",
    value: filter?.sGroupId,
    onChange: (v) => setFilter({ ...filter, sGroupId: v && v !== "null" ? v : undefined })
  });

  return (
    <div>
      <Box mb={4} className="white-box">
        <BoxHeading>🎛 {t("user:observations.filter")}</BoxHeading>
        <Box p={4}>
          <Skeleton isLoaded={speciesGroups.length > 0} mb={2}>
            <Box {...getRootProps()} minH="3.75rem">
              {speciesGroups.map((o) => (
                <CustomRadio
                  key={o.id}
                  icon={o.name}
                  {...getRadioProps({ value: o.id.toString() })}
                  sm={true}
                />
              ))}
            </Box>
          </Skeleton>
          <Skeleton isLoaded={speciesGroups.length > 0} maxW="8rem">
            <Checkbox defaultChecked={filter.hasMedia} onChange={handleOnMediaChange}>
              {t("user:with_media")}
            </Checkbox>
          </Skeleton>
        </Box>
      </Box>
    </div>
  );
}
