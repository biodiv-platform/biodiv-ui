import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleLinear, scaleSequential } from "d3-scale";
import { interpolatePlasma } from "d3-scale-chromatic";
import { select } from "d3-selection";
import React, { useEffect, useRef } from "react";

import { tooltipHelpers, useTooltip } from "./use-tooltip";

function VerticalBarChart({ data, tooltipRenderer }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const ro = useResizeObserver(containerRef);

  const tip = useTooltip(containerRef);
  const tipHelpers = tooltipHelpers(tip, tooltipRenderer);

  let w = 500;
  const h = 400;
  const margin = { top: 30, right: 30, bottom: 50, left: 60 };

  useEffect(() => {
    if (!ro?.width || !data.length) {
      return;
    }

    const svg = select(svgRef.current);

    w = ro.width;
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    svg
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const labels = data.map((sg) => sg.sgroup);
    const counts = data.map((sg) => sg.count);

    const color = scaleSequential(interpolatePlasma).domain([max(counts), min(counts)]);

    const xScale = scaleBand().domain(labels).range([0, width]).padding(0.5);

    const yScale = scaleLinear()
      .domain([0, max(counts)])
      .range([height - 10, 20]);

    svg
      .select(".x-axis")
      .join("g")
      .attr("transform", "translate(" + margin.left + "," + height + ")")
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
      .on("mouseover", tipHelpers.mouseover)
      .on("mousemove", tipHelpers.mousemove)
      .on("mouseleave", tipHelpers.mouseleave)
      .attr("class", "bar")
      .attr("fill", (data) => `${color(data.count)}`)
      .attr("x", (d) => xScale(d.sgroup) + margin.left)
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
      .attr("x", (d) => xScale(d.sgroup) + margin.left)
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
}

export default VerticalBarChart;
