import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { max, rollup } from "d3-array";
import { axisLeft } from "d3-axis";
import { scaleBand, scaleLinear, scaleSequential } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { stack } from "d3-shape";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import DownloadAsPng from "./download-as-png";

interface HorizontalBarChartProps {
  h?: number;

  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;

  barPadding?: number;
  leftOffset?: number;

  data: any[];
}

const StackedHorizontalChart = forwardRef(function StackedHorizontalChart(
  {
    h = 500,
    mt = 10,
    mr = 64,
    mb = 20,
    ml = 60,
    data,
    barPadding = 0.2,
    leftOffset = 0
  }: HorizontalBarChartProps,
  ref
) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const ro = useResizeObserver(containerRef);

  useImperativeHandle(ref, () => ({
    downloadChart() {
      handleDownloadPng();
    }
  }));

  useEffect(() => {
    if (!ro?.width || !data.length) return;

    const groups = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const years = Array.from(new Set(data.map((sg) => sg.year)));

    const colorScale = scaleSequential(interpolateYlGnBu).domain([
      0,
      Math.ceil(1.5 * years.length)
    ]);

    const colors = Array.from({ length: years.length + 1 }, (_, i) => colorScale(i));

    const num = Math.ceil((ro.width - ml - mr) / 38) + 1;

    const rows = Math.floor(years.length / num);

    const svg = select(svgRef.current)
      .attr("width", ro.width)
      .attr("height", h + rows * 40 + 30);

    svg.select(".content").attr("transform", `translate(${ml},${mt})`);

    const series = Array.from(
      rollup(
        data,
        (v) => Object.fromEntries(v.map((d) => [d.year, d.value])),
        (d) => d.month
      ),
      ([month, years]) => ({ month, ...years })
    );

    const maxV = Math.max(
      ...series.map((o) => years.map((k) => o[k] ?? 0).reduce((a, b) => a + b, 0))
    );

    const x: any = scaleLinear()
      .domain([0, maxV])
      .range([0, ro.width - ml - mr]);

    const y = scaleBand()
      .range([0, h - mt - mb])
      .domain(groups)
      .padding(barPadding);
    svg
      .select(".y-axis")
      .join("g")
      .attr("transform", `translate(${leftOffset},0)`)
      .call(axisLeft(y).tickSizeOuter(0) as any);

    const seriesData = stack().keys(years)(series);

    function yPos(d) {
      return y(d.data.month);
    }

    svg
      .select(".chart")
      .selectAll("g")
      .data(seriesData)
      .join("g")
      .attr("fill", (d) => colors[d.index + 1])
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => yPos(d))
      .attr("height", y.bandwidth())
      .attr("width", (d) => (x(d[1]) ? x(d[1]) - x(d[0]) : x(d[0])));

    svg
      .select(".chart")
      .selectAll("g")
      .data(seriesData)
      .join("g")
      .selectAll("line")
      .data((d) => d)
      .join("line")
      .attr("x1", (d) => x(d[1])) // Position the line on the right edge of the rect
      .attr("x2", (d) => x(d[1]))
      .attr("y1", (d) => yPos(d))
      .attr("y2", (d) => yPos(d) + y.bandwidth()) // Extend the line for the full height of the rect
      .attr("stroke", "red") // Set the line color for the right border
      .attr("stroke-width", 0.6);

    let legendWidth = (ro.width - ml - mr) / (years.length + 1);

    if (legendWidth < 38) {
      legendWidth = 38;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function handleLegendClick(key, ro) {
      const filteredData = seriesData.filter((series) => series.key === key);

      const maxValue = max(filteredData, (series) => max(series, (d) => d[1] - d[0]));

      const xValue: any = scaleLinear()
        .domain([0, maxValue])
        .range([0, ro.width - ml - mr]);

      svg
        .select(".chart")
        .selectAll("g")
        .data(filteredData)
        .join("g")
        .attr("fill", (d) => colors[d.index + 1])
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("x", xValue(0))
        .attr("y", (d) => yPos(d))
        .attr("height", y.bandwidth())
        .attr("width", (d) => xValue(d[1]) - xValue(d[0]));

      svg
        .select(".chart")
        .join("g")
        .data(filteredData)
        .selectAll("text")
        .data((d) => d)
        .join("text")
        .attr("font-size", 10)
        .attr("class", "legend-text")
        .attr("y", (d) => yPos(d) + y.bandwidth() / 2 + 5)
        .attr("x", (d) => xValue(d[1]) - xValue(d[0]) + 10)
        .text((d) => (Number.isNaN(d[1]) ? null : d[1] - d[0]));

      svg.selectAll("line").remove();
    }

    function handleReset() {
      svg
        .select(".chart")
        .selectAll("g")
        .data(seriesData)
        .join("g")
        .attr("fill", (d) => colors[d.index + 1])
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => yPos(d))
        .attr("height", y.bandwidth())
        .attr("width", (d) => (x(d[1]) ? x(d[1]) - x(d[0]) : x(d[0])));

      svg
        .select(".chart")
        .selectAll("g")
        .data(seriesData)
        .join("g")
        .selectAll("line")
        .data((d) => d)
        .join("line")
        .attr("x1", (d) => x(d[1])) // Position the line on the right edge of the rect
        .attr("x2", (d) => x(d[1]))
        .attr("y1", (d) => yPos(d))
        .attr("y2", (d) => yPos(d) + y.bandwidth()) // Extend the line for the full height of the rect
        .attr("stroke", "red") // Set the line color for the right border
        .attr("stroke-width", 0.6);

      svg.selectAll(".legend-text").remove();
    }

    const legend = svg
      .select(".legend")
      .attr("transform", `translate(${-ml}, ${h - mt - mb + 10})`);

    legend
      .selectAll("rect")
      .data(years.concat("All"))
      .join("rect")
      .attr("x", (d, i) => (i % num) * legendWidth + ml)
      .attr("y", (d, i) => Math.floor(i / num) * 40)
      .attr("width", legendWidth - 2)
      .attr("height", 20)
      .attr("fill", (d, i) => (d == "All" ? "#ccc" : colors[i + 1]))
      .style("cursor", "pointer")
      .on("click", (event, d) => (d == "All" ? handleReset() : handleLegendClick(d, ro)));

    legend
      .selectAll("text")
      .data(years.concat("All"))
      .join("text")
      .attr("x", (d, i) => (i % num) * legendWidth + ml + 5)
      .attr("y", (d, i) => Math.floor(i / num) * 40 + 35)
      .text((d) => d)
      .style("font-size", "13px");
  }, [containerRef, ro?.width, h, data]);

  const handleDownloadPng = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    if (!ro) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);

    DownloadAsPng({ ro, h: ro.height, svgData });
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <svg width={ro?.width} height={h} ref={svgRef}>
        <g className="content">
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="chart" />
          <g className="legend"></g>
        </g>
      </svg>
    </div>
  );
});

export default StackedHorizontalChart;
