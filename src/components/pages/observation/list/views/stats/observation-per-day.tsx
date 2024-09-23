
import {ArrowBackIcon,ArrowForwardIcon} from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import CalendarHeatMap from "./calendar-heatmap";
import { ObservationTooltipRenderer } from "./static-data";
import useCountPerDay from "./use-count-per-day";

const ObservationPerDay = ({ filter , group}) => {

  const { t } = useTranslation();
  const count = useCountPerDay({ filter });

  const [currentIndex, setCurrentIndex] = useState(0);

  const data = count.data.list;
  const isLoading = count.data.isLoading;
  if (isLoading) {
    return <p>Loading...</p>;
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

  // eslint-disable-next-line no-console
  console.log(years)

  return (
      <Box className="white-box" mb={4} minWidth={"1250px"}>
      {group == "created" ? (
        <BoxHeading>📊 {t("observation:list.chart.temporal_distribution_date_created")}</BoxHeading>
      ) : (
        <BoxHeading>📊 {t("observation:list.chart.temporal_distribution_date_observed")}</BoxHeading>
      )}
      <Box >
        <div>
        <div style={{position:"relative", display:"flex", justifyContent:"center", alignItems:"center"}}>
          {currentIndex!=0 &&<ArrowBackIcon style={{position:"absolute",  left:"20px", fontSize:"2rem"}} onClick={prevSlide}/>}
          {currentIndex!=years.length-1&&<ArrowForwardIcon style={{position:"absolute",  right:"20px", fontSize:"2rem"}} onClick={nextSlide}/>}
          <div>
          <div style={{marginLeft:"600px", paddingTop:"50px"}}>{years[currentIndex]}</div>
            <CalendarHeatMap year={years[currentIndex]} data={data[years[currentIndex]]} tooltipRenderer={ObservationTooltipRenderer}/></div>
        </div>
        </div>
      </Box>
    </Box>
  );
};

export default ObservationPerDay;