import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Select } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import CalendarHeatMap from "@components/pages/observation/list/views/stats/calendar-heatmap";
import { ObservationTooltipRenderer } from "@components/pages/observation/list/views/stats/static-data";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";


export default function TemporalCreatedOn({data}) {
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data) {
    return <div></div>;
  }

  let years = Object.keys(data);
  if(years.length==0){
    const now = new Date();
    const year = now.getFullYear().toString();
    data = {[year]:[{"date":year+"-01-01",value:0}]};
    years = [year];
  }
  years.reverse();

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
    <Box className="white-box" mb={4} minWidth={'800px'}>
        <BoxHeading>📊 {t("user:observations.temporal_created_on")}</BoxHeading>
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
}