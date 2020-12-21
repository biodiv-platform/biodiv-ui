import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { tooltipHelpers, useTooltip } from "@components/charts/hooks/use-tooltip";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import React, { useEffect, useRef } from "react";

interface VerticalBarChartProps {
  h?: number;
  w?: number;
  data: any[];
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;

  tooltipRenderer;
}

const VerticalBarChart = ({
  data,
  tooltipRenderer,
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

  useEffect(() => {
    if (!ro?.width || !data.length) {
      return;
    }

    const svg = select(svgRef.current);

    w = ro.width;
    const width = w - ml - mr;
    const height = h - mt - mb;

    svg.attr("width", w).attr("height", h).append("g").attr("transform", `translate(${ml},${mt})`);

    svg.select(".content").attr("transform", `translate(${ml},${mt})`);

    const labels = data.map((sg) => sg.sgroup);
    const counts = data.map((sg) => sg.count);

    const xScale = scaleBand().domain(labels).range([0, width]).padding(0.5);

    const yScale = scaleLinear()
      .domain([0, max(counts)])
      .range([height - 10, 20]);

    svg
      .select(".x-axis")
      .join("g")
      .attr("transform", `translate(${ml},${height})`)
      .call(axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg.select(".y-axis").join("g").attr("transform", "translate(60,10)").call(axisLeft(yScale));

    svg
      .select(".chart")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
      .on("mousemove", tipHelpers.mousemove)
      .on("mouseleave", tipHelpers.mouseleave)
      .attr("class", "bar")
      .attr("fill", "#228B22")
      .attr("x", (d) => xScale(d.sgroup) + ml)
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.count));

    svg
      .select(".chart")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("font-size", 10)
      .attr("y", (d) => yScale(d.count) - 4)
      .attr("x", (d) => xScale(d.sgroup) + xScale.bandwidth() / 2 + ml)
      .attr("text-anchor", "middle")
      .text((d) => d.count);
  }, [containerRef, ro?.width, h, data]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <svg width={ro?.width} height={h} ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="chart" />
      </svg>
      <div className="tooltip" />
    </div>
  );
};

export default VerticalBarChart;
