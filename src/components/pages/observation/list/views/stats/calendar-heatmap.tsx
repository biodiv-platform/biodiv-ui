import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { tooltipHelpers, useTooltip } from "@components/charts/hooks/use-tooltip";
import * as d3 from "d3";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand } from "d3-scale";
import { select } from "d3-selection";
import { useRouter } from 'next/router';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import DownloadAsPng from "./download-as-png";

interface HeatMapChartProps {
  h?: number;
  year : string;
  w?: number;
  data: any[];
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  tooltipRenderer;
}

const CalendarHeatMap = forwardRef(({
  data,
  w = 500,
  h = 400,
  tooltipRenderer,
  year,
  mt = 30,
  mr = 30,
  mb = 50,
  ml = 60
}: HeatMapChartProps,ref) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const ro = useResizeObserver(containerRef);
  const tip = useTooltip(containerRef);

  const tipHelpers = tooltipHelpers(tip, tooltipRenderer, 10, -50);

  const router = useRouter();

  useImperativeHandle(ref, () => ({
    downloadChart() {
      handleDownloadPng();
    },
  }));

  useEffect(() => {
    if (!ro?.width || !data.length) {
      return;
    }

    const svg = select(svgRef.current);
    w =ro.width;
    h=(w/5)+5;
    const width = w - ml - mr;
    const height = h - mt - mb;

    svg.attr("width", w).attr("height", h).append("g").attr("transform", `translate(${ml},${mt})`);

    svg.select(".content").attr("transform", `translate(${ml},${mt})`);

    function getDatesBetween(startDate, endDate) {
      const datesArray :{ date: string; value: number }[] = [];
      const currentDate = new Date(startDate);
    
      while (currentDate <= new Date(endDate)) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        datesArray.push({date: year+'-'+month+'-'+day, value:0}); // Push date in 'YYYY-MM-DD' format
    
        currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
      }
    
      return datesArray;
    }

    const lastDay = new Date(year+"-01-01");
    lastDay.setDate(lastDay.getDate() - lastDay.getDay())


    if(data[0].date.substring(5,)!="01-01"){
      const firstDate = year+"-01-01"
      const startDate = data[0].date
      const startdatesList = getDatesBetween(firstDate, startDate);
      data = [...startdatesList.slice(0,-1) ,...data]
    }

    if(data[data.length-1].date.substring(5,)!="12-31"){
      const lastDate = year + "-12-31"
      const endDate = data[data.length - 1].date
      const datesList = getDatesBetween(endDate,lastDate)
      data = [...data, ...datesList.slice(1)]
    }

    const labels = d3.range(0,54);
    const counts = d3.range(0,7);
    counts.reverse()

    const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    WeekDays.reverse()
    const Months = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const xScale = scaleBand().domain(labels).range([0, width]).padding(0.05);

    const yScale = scaleBand()
      .domain(counts)
      .range([height, 0]).padding(0.05);

      const weekScale = scaleBand()
      .domain(WeekDays)
      .range([height, 0]).padding(0.05);

    function yValue(date) {
        const DayDate = new Date(date);
        return yScale(DayDate.getDay())
      }

    const monthScale = scaleBand().domain(Months).range([0, width]).padding(0.05);
  
    function xValue(date) {
        const DayDate = new Date(date);
        return xScale(Math.floor((DayDate.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24 * 7)))+ml
      }

    const colorScale = d3
      .scaleSequential(d3.interpolateBuGn)
      .domain([0, 1]);

      const maxValue = max(data, d => d.value);

    function color(value) {
      if (value == 0) {
        return "lightgrey"
      }
      const log = Math.log(value) / Math.log(maxValue)
      return colorScale(log)
    }

    svg
      .select(".chart")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
      .on("mousemove", tipHelpers.mousemove)
      .on("mouseleave", tipHelpers.mouseleave)
      .attr("fill", (d) => color(d.value))
      .attr("x", (d) => xValue(d.date))
      .attr("y", (d) => yValue(d.date))
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("cursor", "pointer")
      .on("click",(event,d)=>{
        const minDay = new Date(d.date);
        minDay.setDate(minDay.getDate() - 1)
        const year = minDay.getFullYear();
        const month = String(minDay.getMonth() + 1).padStart(2, '0'); 
        const day = String(minDay.getDate()).padStart(2, '0');
        router.push({
          pathname: '/observation/list',
          query: { offset: 0, createdOnMaxDate: d.date+"T18:30:00Z", createdOnMinDate:`${year}-${month}-${day}T18:30:00Z` },
        });
      });

        svg
        .select(".x-axis")
        .join("g")
        .attr("transform", `translate(${ml},${height})`)
        .call(axisBottom(monthScale))
        .selectAll("text")
        .style("text-anchor", "end");
  
      svg.select(".y-axis").join("g").attr("transform", "translate(60,0)").call(axisLeft(weekScale));

      svg.selectAll(".domain").remove();
      svg.selectAll(".tick line").remove();
  }, [containerRef, ro?.width, h, data]);

  const handleDownloadPng = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    if(!ro) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    w =ro.width;
    h=(w/5)-35;

    DownloadAsPng({ro,h,svgData})
  };

  return (
    <div ref={containerRef} style={{ position: "relative"}}>
      <svg width={ro?.width} height={245} ref={svgRef} >
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="chart" />
      </svg>
      <div className="tooltip" />
    </div>
  );
});

export default CalendarHeatMap;
