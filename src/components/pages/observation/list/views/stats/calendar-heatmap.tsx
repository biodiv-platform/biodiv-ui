import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { tooltipHelpers, useTooltip } from "@components/charts/hooks/use-tooltip";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useRouter } from 'next/router';


interface VerticalBarChartProps {
  h?: number;
  w?: number;
  data: any[];
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  year:String;

  tooltipRenderer;
}

const CalendarHeatmap = ({
  data,
  tooltipRenderer,
  year,
  w = 500,
  h = 400,
  mt = 30,
  mr = 30,
  mb = 50,
  ml = 60
}: VerticalBarChartProps) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const ro = useResizeObserver(containerRef);
  const tip = useTooltip(containerRef);

  const tipHelpers = tooltipHelpers(tip, tooltipRenderer, 10, -50);

  const router = useRouter();

  w = 1250;
  h=250;
  const width = w - ml - mr;
  const height = h - mt - mb;

  const Months=["Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const WeekDays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  WeekDays.reverse()
  const allXGroups = d3.range(0,53);
  const allYGroups = d3.range(0,7);
  allYGroups.reverse()

  const labels = allXGroups;
  const counts = allYGroups;

  const sortedValues = data.map(item => item.value).sort((a, b) => a - b);

  const xScale = scaleBand().domain(labels).range([0, width]).padding(0.05);

  const monthScale = d3
      .scaleBand()
      .range([0,width])
      .domain(Months)
      .padding(0.01);

    const yScale = scaleBand()
      .domain(allYGroups)
      .range([height,0]).padding(0.05);

      const MonthLabels = Months.map((name,i)=>{
        const xPos = monthScale(name) ?? 0;
        return(
          <text
            key={i}
            x= {xPos + monthScale.bandwidth() / 2+ml}
            y={height+10}
            textAnchor='end'
            dominantBaseline="middle"
            fontSize={12}
          >
            {name}
          </text>
        )
      })

      const yLabels = allYGroups.map((name, i) => {
        const yPos = yScale(name) ?? 0;
        return (
          <text
            key={i}
            x={ml-10}
            y={yPos + yScale.bandwidth() / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={11}
          >
            {WeekDays[i]}
          </text>
        );
      });
  useEffect(() => {
    if ( !data.length) {
      return;
    }

    const svg = select(svgRef.current);

    svg.attr("width", w).attr("height", h).append("g").attr("transform", `translate(${ml},${mt})`);

    svg.select(".content").attr("transform", `translate(${ml},${mt})`);


    let lastDay = new Date(data[0].date);
    lastDay.setDate(lastDay.getDate()-lastDay.getDay())


    function yValue(date){
        const DayDate = new Date(date);
        return yScale(DayDate.getDay())
      }

    function xValue(date){
        const DayDate = new Date(date);
        return xScale(Math.floor((DayDate.getTime()-lastDay.getTime())/(1000*60*60*24*7)))
      }
      const maxValue = max(data, d=>d.value);

    const colorScale = d3
      .scaleSequential(d3.interpolateBuGn)
      .domain([0, 1]);

      function color(value){
        if(value==0){
          return "lightgrey"
        }
        const log = Math.log(value)/Math.log(maxValue)
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
      .attr("fill", (d)=>color(d.value))
      .attr("x", (d) => xValue(d.date) + ml)
      .attr("y", (d) => yValue(d.date))
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .on("click", (event, d)=> {
        let minDay = new Date(d.date);
        minDay.setDate(minDay.getDate()-1)
        const year = minDay.getFullYear();
        const month = String(minDay.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so +1
        const day = String(minDay.getDate()).padStart(2, '0');
        router.push('http://localhost:3000/observation/list?createdOnMaxDate='+d.date+'T18%3A30%3A00Z&createdOnMinDate='+`${year}-${month}-${day}`+'T18%3A30%3A00Z&max=8&mediaFilter=no_of_images%2Cno_of_videos%2Cno_of_audio%2Cno_media&offset=0&sort=created_on&userGroupList&view=list');
      });
  }, [containerRef, ro?.width, data]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {year}
      <svg width={1150} height={250} ref={svgRef}>
        <g className="chart" />
        {yLabels}
        {MonthLabels}
      </svg>
      <div className="tooltip" />
    </div>
  );
};

export default CalendarHeatmap;