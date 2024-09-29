import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Select, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import CalendarHeatMap from "@components/pages/observation/list/views/stats/calendar-heatmap";
import { ObservationTooltipRenderer } from "@components/pages/observation/list/views/stats/static-data";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import useTemporalData from "./use-temporal-observation-data";

export default function TemporalDistribution(userId) {
  const { t } = useTranslation();
  const temporalData = useTemporalData(userId.userId);

  const [currentIndex, setCurrentIndex] = useState(0);

  const data = temporalData.data.list;
  const isLoading = temporalData.data.isLoading;
  if (isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!data) {
    return <p>No data available</p>;
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
    <Box className="white-box" mb={4} minWidth={"1150px"}>
        <BoxHeading>📊 {t("user:observations.temporal_created_on")}</BoxHeading>
        <Box >
        <div>
        <div style={{position:"relative", display:"flex", justifyContent:"center", alignItems:"center"}}>
          {currentIndex!=0 &&<ArrowBackIcon style={{position:"absolute",  left:"5px", fontSize:"2rem"}} onClick={prevSlide}/>}
          {currentIndex!=years.length-1&&<ArrowForwardIcon style={{position:"absolute",  right:"5px", fontSize:"2rem"}} onClick={nextSlide}/>}
          <div>
          <div style={{marginLeft:"45%", paddingTop:"25px", paddingBottom:"25px"}}><Select
              maxW="6rem"
              value={currentIndex}
              onChange={handleOnChange}
            >
              {years.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </Select></div>
            <CalendarHeatMap year={years[currentIndex]} data={data[years[currentIndex]]} tooltipRenderer={ObservationTooltipRenderer} w={1100}/></div>
        </div>
        </div>
      </Box>
    </Box>
  );
}