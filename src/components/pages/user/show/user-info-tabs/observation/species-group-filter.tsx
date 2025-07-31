import { Box, Skeleton, Wrap, WrapItem } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import CustomRadio from "@components/pages/observation/create/form/groups/custom-radio";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

export default function SpeciesGroupFilter({ filter, setFilter, speciesGroups }) {
  const { t } = useTranslation();

  const handleOnMediaChange = (e) => {
    setFilter({ ...filter, hasMedia: e.target.checked });
  };

  return (
    <div>
      <Box mb={4} className="white-box">
        <BoxHeading>🎛 {t("user:observations.filter")}</BoxHeading>
        <Box p={4}>
          <Skeleton loading={speciesGroups.length < 0} mb={2}>
            <RadioCard.Root
              value={filter?.sGroupId?.toString()}
              onValueChange={(e) =>
                setFilter({ ...filter, sGroupId: e.value ? e.value : undefined })
              }
              orientation="horizontal"
              align="center"
              colorPalette={"blue"}
              size={"sm"}
            >
              <Wrap gap={4} justify="flex-start">
                {speciesGroups.map((o) => (
                  <WrapItem key={o.id}>
                    <CustomRadio
                      key={o.id}
                      value={o.id.toString()}
                      icon={o.name}
                      checked={filter?.sGroupId == o.id}
                    />
                  </WrapItem>
                ))}
              </Wrap>
            </RadioCard.Root>
          </Skeleton>
          <Skeleton loading={speciesGroups.length < 0} maxW="8rem">
            <Checkbox
              defaultChecked={filter.hasMedia}
              onChange={handleOnMediaChange}
              colorPalette={"blue"}
            >
              {t("user:with_media")}
            </Checkbox>
          </Skeleton>
        </Box>
      </Box>
    </div>
  );
}
