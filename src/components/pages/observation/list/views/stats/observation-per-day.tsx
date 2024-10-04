
import {ArrowBackIcon,ArrowForwardIcon} from "@chakra-ui/icons"
import { Box, Button, Select, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import CalendarHeatMap from "./calendar-heatmap";
import { ObservationTooltipRenderer } from "./static-data";
import useCountPerDay from "./use-count-per-day";

const ObservationPerDay = ({ filter }) => {

  const { t } = useTranslation();
  const count = useCountPerDay({ filter });

  const [currentIndex, setCurrentIndex] = useState(0);

  const data = count.data.list;
  const isLoading = count.data.isLoading;
  if (isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!data) {
    return <div></div>;
  }

  const years = Object.keys(data);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? years.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === years.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleOnChange = (e) => {
    const v = e?.target?.value;
    setCurrentIndex(v)
  };

  return (
      <Box className="white-box" mb={4} >
        <BoxHeading>📊 {t("observation:list.chart.temporal_distribution_date_created")}</BoxHeading>
      <Box position={'relative'}>
        {currentIndex!=0&&<div style={{position:'absolute', top:'45%', left:'10px'}}><Button width={25} onClick={prevSlide}><ArrowBackIcon/></Button></div>}
        {currentIndex!=years.length-1&&<div style={{position:'absolute', top:'45%', right:'10px'}}><Button width={25} onClick={nextSlide}><ArrowForwardIcon/></Button></div>}
        <div style={{marginLeft:"45%", paddingTop:"25px", paddingBottom:"25px"}}>
          <Select
            fontSize="13px"
            maxW="5rem"
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
        <div style={{paddingLeft:'30px',paddingRight:'35px'}}>
          <CalendarHeatMap year={years[currentIndex]} data={data[years[currentIndex]]} tooltipRenderer={ObservationTooltipRenderer} />
        </div>
      </Box>
    </Box>
  );
};

export default ObservationPerDay;