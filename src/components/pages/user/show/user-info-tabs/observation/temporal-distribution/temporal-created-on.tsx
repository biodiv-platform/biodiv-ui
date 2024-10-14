import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Select, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import CalendarHeatMap from "@components/pages/observation/list/views/stats/calendar-heatmap";
import { ObservationTooltipRenderer } from "@components/pages/observation/list/views/stats/static-data";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";

import useTemporalData from "./use-temporal-observation-data";

export default function TemporalCreatedOn(userId) {
  const { t } = useTranslation();
  const chartRef = useRef<any>(null);

  const handleDownload = async () => {
    await waitForAuth();
    if (chartRef.current) {
      chartRef.current.downloadChart();
    }
    const payload = {
      filePath: "",
      filterUrl: window.location.href,
      status: "success",
      fileType: "png",
      sourcetype: "User",
      notes: "Temporal Distribution - Created On"
    };
    axAddDownloadLog(payload);
  };
  const temporalData = useTemporalData(userId.userId);

  const [currentIndex, setCurrentIndex] = useState(0);
  let data = temporalData.data.list["createdOn"];
  const isLoading = temporalData.data.isLoading;
  if (isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!data) {
    return <div></div>;
  }

  let years = Object.keys(data);
  if (years.length == 0) {
    const now = new Date();
    const year = now.getFullYear().toString();
    data = { [year]: [{ date: year + "-01-01", value: 0 }] };
    years = [year];
  }
  years.reverse();

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? years.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === years.length - 1 ? 0 : prevIndex + 1));
  };

  const handleOnChange = (e) => {
    const v = e?.target?.value;
    setCurrentIndex(v);
  };

  return (
    <Box className="white-box" mb={4} minWidth={"800px"}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("user:observations.temporal_created_on")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorScheme="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box position={"relative"}>
        {currentIndex != 0 && (
          <div style={{ position: "absolute", top: "45%", left: "10px" }}>
            <Button width={25} onClick={prevSlide}>
              <ArrowBackIcon />
            </Button>
          </div>
        )}
        {currentIndex != years.length - 1 && (
          <div style={{ position: "absolute", top: "45%", right: "10px" }}>
            <Button width={25} onClick={nextSlide}>
              <ArrowForwardIcon />
            </Button>
          </div>
        )}
        <div style={{ marginLeft: "45%", paddingTop: "25px", paddingBottom: "25px" }}>
          <Select fontSize="13px" maxW="5rem" value={currentIndex} onChange={handleOnChange}>
            {years.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div style={{ paddingLeft: "30px", paddingRight: "35px" }}>
          <CalendarHeatMap
            year={years[currentIndex]}
            data={data[years[currentIndex]]}
            tooltipRenderer={ObservationTooltipRenderer}
            ref={chartRef}
          />
        </div>
      </Box>
    </Box>
  );
}
