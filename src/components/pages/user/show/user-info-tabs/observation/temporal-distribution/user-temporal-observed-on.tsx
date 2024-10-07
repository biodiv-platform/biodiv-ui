import { Box, Select } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import StackedHorizontalChart from "@components/pages/observation/list/views/stats/stacked-horizontal-chart";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";


export default function UserTemporalObservedOn({data}) {
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data) {
    return <div></div>;
  }

  const years = Object.keys(data);
  years.reverse()

  const handleOnChange = (e) => {
    const v = e?.target?.value;
    setCurrentIndex(v)
  };

  return (
      <Box className="white-box" mb={4}>
        <BoxHeading styles={{display:"flex",justifyContent:"space-between"}}>📊 {t("user:observations.temporal_month_observed")}</BoxHeading>
      <Box p={4}>
      <div style={{marginLeft:"45%", paddingTop:"25px", paddingBottom:"25px"}}>
          <Select
            fontSize="13px"
            maxW="7rem"
            value={currentIndex}
            onChange={handleOnChange}
          >
            {years.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <StackedHorizontalChart data={data[years[currentIndex]]}/>
      </Box>
    </Box>
  );
}