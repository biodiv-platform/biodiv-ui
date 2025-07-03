import { Box, Button, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import { LuMoveLeft, LuMoveRight } from "react-icons/lu";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { toaster } from "@/components/ui/toaster";

import CalendarHeatMap from "./calendar-heatmap";
import { ObservationTooltipRenderer } from "./static-data";
import useTemporalDistributionCreatedOnData from "./use-temporal-distribution-created-on-data";

const ObservationPerDay = ({ filter }) => {
  const countPerDay = useTemporalDistributionCreatedOnData({ filter });
  const { t } = useTranslation();
  const chartRef = useRef<any>(null);

  // Add useBreakpointValue to hide icons based on screen width
  const showNavigationIcons = useBreakpointValue({ base: false, md: true }); // Hide on small screens, show on medium and larger screens

  const padding = useBreakpointValue({ base: "5px 10px", md: "30px 35px" });

  const handleDownload = async () => {
    try {
      await waitForAuth();
      if (chartRef.current) {
        chartRef.current.downloadChart();
        const payload = {
          filePath: "",
          filterUrl: window.location.href,
          status: "success",
          fileType: "png",
          sourcetype: "Observations",
          notes: "Temporal Distribution - Date Created"
        };
        axAddDownloadLog(payload);
      }
    } catch (error) {
      console.error("Download error:", error);
      toaster.create({
        title: "Error while downloading",
        type: "error",
        closable: true
      });
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  if (countPerDay.data.isLoading) {
    return <Skeleton h={450} borderRadius="md" mb={4} />;
  }

  if (!countPerDay.data.list) {
    return <div></div>;
  }

  function getYearRange(startYear, endYear) {
    const years : string[]= [];
    for (let y = parseInt(startYear); y <= parseInt(endYear); y++) {
      years.push(y.toString());
    }
    return years;
  }

  const years = getYearRange(countPerDay.data.minDate, countPerDay.data.maxDate)
  years.reverse();

  const prevSlide = () => {
    countPerDay.loadMore(years[(currentIndex === years.length - 1 ? 0 : currentIndex - 1)])
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? years.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    countPerDay.loadMore(years[(currentIndex === years.length - 1 ? 0 : currentIndex + 1)])
    setCurrentIndex((prevIndex) => (prevIndex === years.length - 1 ? 0 : prevIndex + 1));
  };

  const handleOnChange = (e) => {
    const v = parseInt(e.target.value, 10); // Ensure the value is an integer
    countPerDay.loadMore(years[v])
    setCurrentIndex(v);
  };

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.temporal_distribution_date_created")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box position={"relative"}>
        {showNavigationIcons && currentIndex != years.length - 1 && (
          <Box position="absolute" top="45%" left="10px">
            <Button width={25} onClick={nextSlide} variant="ghost">
              <LuMoveLeft />
            </Button>
          </Box>
        )}
        {showNavigationIcons && currentIndex != 0 && (
          <Box position="absolute" top="45%" right="10px">
            <Button width={25} onClick={prevSlide} variant="ghost">
              <LuMoveRight />
            </Button>
          </Box>
        )}
        <Box marginLeft="45%" paddingTop="25px" paddingBottom="25px">
          <NativeSelectRoot
            fontSize="13px"
            maxW="5rem"
            defaultValue={currentIndex}
            onChange={handleOnChange}
          >
            <NativeSelectField>
              {years.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>
        <Box padding={padding}>
          <CalendarHeatMap
            year={years[currentIndex]}
            data={countPerDay.data.list[years[currentIndex]]||[]}
            tooltipRenderer={ObservationTooltipRenderer}
            ref={chartRef}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ObservationPerDay;
