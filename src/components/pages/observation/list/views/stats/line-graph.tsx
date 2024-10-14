import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scalePoint, scaleSequential } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { area, curveBasis, line } from "d3-shape";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import DownloadAsPng from "./download-as-png";

interface HorizontalBarChartProps {
  h?: number;

  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  data: any[];

  barPadding?: number;
  leftOffset?: number;
}

const LineGraph = forwardRef(function LineGraph(
  { h = 2000, mt = 30, mr = 60, mb = 50, ml = 60, data }: HorizontalBarChartProps,
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
    if (!ro?.width) return;

    const traits = Array.from(new Set(data.map((series) => series.name.split("|")[0])));
    const months = [
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
    const colorScale = scaleSequential(interpolateYlGnBu).domain([
      0,
      Math.ceil(1.5 * traits.length)
    ]);
    function color(d) {
      const index = traits.indexOf(d);
      return colorScale(index + 1);
    }

    const svg = select(svgRef.current);
    const width = ro.width - ml - mr;
    h = mt + mb + data.length * 50;
    const height = h - mt - mb;

    function abbreviateLabel(label, maxLength) {
      return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
    }

    const x = scalePoint()
      .domain(months)
      .range([0, width - ml]);

    const y = scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, height]);

    svg
      .attr("width", ro.width)
      .attr("height", h + 30)
      .append("g")
      .attr("transform", `translate(${ml},${mt})`);

    svg.select(".content").attr("transform", `translate(${ml},${mt})`);

    const maxValue = max(
      data.flatMap((series) => series.values),
      (d) => d.value
    );

    function ridge(d) {
      return Math.log(d + 1) / Math.log(maxValue + 1);
    }

    svg
      .select(".x-axis")
      .join("g")
      .attr("transform", `translate(${ml},${height})`)
      .call(axisBottom(x))
      .selectAll("text");

    svg
      .select(".y-axis")
      .join("g")
      .attr("transform", `translate(50,${y.bandwidth() / 2})`)
      .call(axisLeft(y).tickSize(0))
      .call((g) => g.select(".domain").remove());

    svg.selectAll(".y-axis .tick text").text((d) => abbreviateLabel(d, 15));

    const areaGenerator = area()
      .curve(curveBasis)
      .x((d, i) => x(months[i]) + ml + x.bandwidth() / 2 || 0)
      .y1((d) => y(d.seriesName) + y.bandwidth() - ridge(d.value) * 45)
      .y0((d) => y(d.seriesName) + y.bandwidth());

    svg
      .select(".chart")
      .selectAll(".ridgeline-area")
      .data(data)
      .join("path")
      .attr("class", "ridgeline-area")
      .attr("fill", (d) => color(d.name.split("|")[0]))
      .attr("opacity", 0.7)
      .attr("stroke", "none")
      .attr("d", (series) =>
        areaGenerator(
          series.values.map((d) => ({
            value: d.value,
            seriesName: series.name
          }))
        )
      );

    svg
      .select(".chart")
      .selectAll(".ridgeline")
      .data(data)
      .join("path")
      .attr("class", "ridgeline")
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.name.split("|")[0]))
      .attr("stroke-width", 1.5)
      .attr("d", (series) =>
        line()
          .curve(curveBasis)
          .x((d: any, i: number) => x(months[i]) + ml + x.bandwidth() / 2 || ml)
          .y((d: any) => y(series.name) + y.bandwidth() - ridge(d.value) * 45)(series.values)
      );

    function handleLegendClick(key, ro) {
      const filteredData = data.filter((series) => series.name.split("|")[0] === key);
      h = mt + mb + filteredData.length * 50;
      svg.attr("height", h + 30);
      const colorScale = scaleSequential(interpolateYlGnBu).domain([
        0,
        Math.ceil(1.5 * filteredData.length)
      ]);
      const y = scaleBand()
        .domain(filteredData.map((d) => d.name.split("|")[1]))
        .range([0, h - mt - mb]);

      const maxValue = max(
        filteredData.flatMap((series) => series.values),
        (d) => d.value
      );

      function ridge(d) {
        return Math.log(d + 1) / Math.log(maxValue + 1);
      }

      svg.select(".y-axis").selectAll("*").remove();
      svg
        .select(".y-axis")
        .join("g")
        .attr("transform", `translate(50,${y.bandwidth() / 2})`)
        .call(axisLeft(y).tickSize(0))
        .call((g) => g.select(".domain").remove());
      svg.select(".chart").selectAll("*").remove();
      svg
        .select(".x-axis")
        .join("g")
        .attr("transform", `translate(${ml},${h - mt - mb})`)
        .call(axisBottom(x))
        .selectAll("text");
      svg
        .select(".chart")
        .selectAll(".ridgeline")
        .data(filteredData)
        .join("path")
        .attr("class", "ridgeline")
        .attr("fill", "none")
        .attr("stroke", (d, i) => colorScale(i + 1))
        .attr("stroke-width", 1.5)
        .attr("d", (series) =>
          line()
            .curve(curveBasis)
            .x((d: any, i: number) => x(months[i]) + ml + x.bandwidth() / 2 || ml)
            .y((d: any) => y(series.name.split("|")[1]) + y.bandwidth() - ridge(d.value) * 45)(
            series.values
          )
        );
      const areaGenerator = area()
        .curve(curveBasis)
        .x((d, i) => x(months[i]) + ml + x.bandwidth() / 2 || 0)
        .y1((d) => y(d.seriesName.split("|")[1]) + y.bandwidth() - ridge(d.value) * 45)
        .y0((d) => y(d.seriesName.split("|")[1]) + y.bandwidth());

      svg
        .select(".chart")
        .selectAll(".ridgeline-area")
        .data(filteredData)
        .join("path")
        .attr("class", "ridgeline-area")
        .attr("fill", (d, i) => colorScale(i + 1))
        .attr("opacity", 0.7)
        .attr("stroke", "none")
        .attr("d", (series) =>
          areaGenerator(
            series.values.map((d) => ({
              value: d.value,
              seriesName: series.name
            }))
          )
        );

      const legend = svg
        .select(".legend")
        .attr("transform", `translate(${-ml}, ${h - mt - mb + 10})`);

      const legendWidth = (ro.width - ml - mr - ml) / (traits.length + 1);

      legend
        .selectAll("rect")
        .data(traits.concat("All"))
        .join("rect")
        .attr("x", (d, i) => i * legendWidth + ml + ml)
        .attr("y", () => 20)
        .attr("width", legendWidth - 2)
        .attr("height", 20)
        .attr("fill", (d) => (d == "All" ? "#ccc" : color(d)))
        .style("cursor", "pointer")
        .on("click", (event, d) => (d == "All" ? handleReset(ro) : handleLegendClick(d, ro)));
    }

    function handleReset(ro) {
      h = mt + mb + data.length * 50;
      svg.attr("height", h + 30);
      const y = scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, h - mt - mb]);

      const maxValue = max(
        data.flatMap((series) => series.values),
        (d) => d.value
      );

      function ridge(d) {
        return Math.log(d + 1) / Math.log(maxValue + 1);
      }

      svg.select(".y-axis").selectAll("*").remove();
      svg
        .select(".y-axis")
        .join("g")
        .attr("transform", `translate(50,${y.bandwidth() / 2})`)
        .call(axisLeft(y).tickSize(0))
        .call((g) => g.select(".domain").remove());

      svg.selectAll(".y-axis .tick text").text((d) => abbreviateLabel(d, 15));
      svg.select(".chart").selectAll("*").remove();
      svg
        .select(".x-axis")
        .join("g")
        .attr("transform", `translate(${ml},${h - mt - mb})`)
        .call(axisBottom(x))
        .selectAll("text");
      svg
        .select(".chart")
        .selectAll(".ridgeline")
        .data(data)
        .join("path")
        .attr("class", "ridgeline")
        .attr("fill", "none")
        .attr("stroke", (d) => color(d.name.split("|")[0]))
        .attr("stroke-width", 1.5)
        .attr("d", (series) =>
          line()
            .curve(curveBasis)
            .x((d: any, i: number) => x(months[i]) + ml + x.bandwidth() / 2 || ml)
            .y((d: any) => y(series.name) + y.bandwidth() - ridge(d.value) * 45)(series.values)
        );

      const areaGenerator = area()
        .curve(curveBasis)
        .x((d, i) => x(months[i]) + ml + x.bandwidth() / 2 || 0)
        .y1((d) => y(d.seriesName) + y.bandwidth() - ridge(d.value) * 45)
        .y0((d) => y(d.seriesName) + y.bandwidth());

      svg
        .select(".chart")
        .selectAll(".ridgeline-area")
        .data(data)
        .join("path")
        .attr("class", "ridgeline-area")
        .attr("fill", (d) => color(d.name.split("|")[0]))
        .attr("opacity", 0.7)
        .attr("stroke", "none")
        .attr("d", (series) =>
          areaGenerator(
            series.values.map((d) => ({
              value: d.value,
              seriesName: series.name
            }))
          )
        );

      const legend = svg
        .select(".legend")
        .attr("transform", `translate(${-ml}, ${h - mt - mb + 10})`);

      const legendWidth = (ro.width - ml - mr - ml) / (traits.length + 1);

      legend
        .selectAll("rect")
        .data(traits.concat("All"))
        .join("rect")
        .attr("x", (d, i) => i * legendWidth + ml + ml)
        .attr("y", () => 20)
        .attr("width", legendWidth - 2)
        .attr("height", 20)
        .attr("fill", (d) => (d == "All" ? "#ccc" : color(d)))
        .style("cursor", "pointer")
        .on("click", (event, d) => (d == "All" ? handleReset(ro) : handleLegendClick(d, ro)));
    }

    const legend = svg
      .select(".legend")
      .attr("transform", `translate(${-ml}, ${h - mt - mb + 10})`);

    const legendWidth = (ro.width - ml - mr - ml) / (traits.length + 1);

    legend
      .selectAll("rect")
      .data(traits.concat("All"))
      .join("rect")
      .attr("x", (d, i) => i * legendWidth + ml + ml)
      .attr("y", () => 20)
      .attr("width", legendWidth - 2)
      .attr("height", 20)
      .attr("fill", (d) => (d == "All" ? "#ccc" : color(d)))
      .style("cursor", "pointer")
      .on("click", (event, d) => (d == "All" ? handleReset(ro) : handleLegendClick(d, ro)));

    legend
      .selectAll("text")
      .data(traits.concat("All"))
      .join("text")
      .attr("x", (d, i) => i * legendWidth + ml + ml + 5)
      .attr("y", () => 55)
      .text((d) => abbreviateLabel(d, 4))
      .style("font-size", "13px");
  }, [containerRef, ro?.width, h, data]);

  const handleDownloadPng = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    if (!ro) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);

    h = mt + mb + data.length * 50;

    const downloadh = h + 30;

    DownloadAsPng({ ro, h: downloadh, svgData });
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

export default LineGraph;
