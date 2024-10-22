import { useBreakpointValue } from "@chakra-ui/react";
import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { tooltipHelpers, useTooltip } from "@components/charts/hooks/use-tooltip";
import { Months } from "@static/constants";
import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scalePoint, scaleSequential } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { area, line } from "d3-shape";
import { toPng } from "html-to-image";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { TraitsTooltipRenderer } from "./static-data";

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
  const tip = useTooltip(containerRef);

  const tipHelpers = tooltipHelpers(tip, TraitsTooltipRenderer, 10, -50);
  const isSmall = useBreakpointValue({ base: true, md: false });

  useImperativeHandle(ref, () => ({
    downloadChart() {
      handleDownloadPng();
    }
  }));

  useEffect(() => {
    if (!ro?.width) return;
    if (isSmall) {
      ml = 30;
      mr = 30;
    }
    data.sort((a, b) => a.name.localeCompare(b.name));
    const traits = Array.from(new Set(data.map((series) => series.name.split("|")[0])));
    const colorScale = scaleSequential(interpolateSpectral).domain([0, traits.length - 1]);
    function color(d) {
      const index = traits.indexOf(d);
      return colorScale(index);
    }

    const svg = select(svgRef.current);
    const width = ro.width - ml - mr;
    h = mt + mb + (data.length + traits.length) * 50;
    const height = h - mt - mb;

    function abbreviateLabel(label, maxLength) {
      return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
    }

    const x = scalePoint()
      .domain(Months)
      .range([0, width - ml]);

    const modifiedData: any[] = [{ name: data[0].name.split("|")[0], values: [] }];

    let currentCategory = null;

    data.forEach((d) => {
      const category = d.name.split("|")[0];

      if (currentCategory !== category && currentCategory !== null) {
        modifiedData.push({ name: category, values: [] });
      }

      modifiedData.push(d);
      currentCategory = category;
    });

    const y = scaleBand()
      .domain(modifiedData.map((d) => d.name))
      .range([0, height]);

    svg
      .attr("width", ro.width)
      .attr("height", h + 30)
      .append("g")
      .attr("transform", `translate(${ml},${mt})`);

    svg.select(".content").attr("transform", `translate(${ml},${mt})`);

    function ridge(d, key) {
      const filteredData = data.filter((series) => series.name.split("|")[0] === key);
      const minValue = min(
        filteredData.flatMap((series) => series.values),
        (d) => d.value
      );
      const maxValue = max(
        filteredData.flatMap((series) => series.values),
        (d) => d.value
      );
      return (d - minValue + 1) / (maxValue - minValue + 1);
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
      .attr("transform", `translate(${ml - 10},${y.bandwidth() / 2})`)
      .call(axisLeft(y).tickSize(0))
      .call((g) => g.select(".domain").remove());

    svg.selectAll(".y-axis .tick text").text((d) => d.split("|")[1]);

    const areaGenerator = area()
      .x((d, i) => x(Months[i]) + ml + x.bandwidth() / 2 || 0)
      .y1((d) => y(d.seriesName) + y.bandwidth() - ridge(d.value, d.seriesName.split("|")[0]) * 45)
      .y0((d) => y(d.seriesName) + y.bandwidth());

    svg
      .select(".chart")
      .selectAll(".ridgeline-area")
      .data(data)
      .join("path")
      .attr("class", "ridgeline-area")
      .attr("fill", (d) => color(d.name.split("|")[0]))
      .attr("opacity", 0.5)
      .attr("stroke", "none")
      .attr("d", (series) =>
        areaGenerator(
          series.values.map((d) => ({
            value: d.value,
            seriesName: series.name
          }))
        )
      )
      .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
      .on("mousemove", tipHelpers.mousemove)
      .on("mouseleave", tipHelpers.mouseleave);

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
          .x((d: any, i: number) => x(Months[i]) + ml + x.bandwidth() / 2 || ml)
          .y(
            (d: any) =>
              y(series.name) + y.bandwidth() - ridge(d.value, series.name.split("|")[0]) * 45
          )(series.values)
      )
      .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
      .on("mousemove", tipHelpers.mousemove)
      .on("mouseleave", tipHelpers.mouseleave);

    svg
      .select(".heading")
      .selectAll("text")
      .data(traits)
      .join("text")
      .attr("x", ml)
      .attr("y", (d) => y(d) + y.bandwidth()+10)
      .text((d) => d + " :")
      .style("font-size", "16.5px");

    function handleLegendClick(key, ro) {
      svg.select(".heading").selectAll("*").remove();
      const filteredData = data.filter((series) => series.name.split("|")[0] === key);
      h = mt + mb + (filteredData.length + 1) * 50;
      svg.attr("height", h + 30);
      const colorScale = scaleSequential(interpolateSpectral).domain([0, filteredData.length - 1]);
      const y = scaleBand()
        .domain(filteredData.map((d) => d.name.split("|")[1]))
        .range([50, h - mt - mb]);

      const maxValue = max(
        filteredData.flatMap((series) => series.values),
        (d) => d.value
      );

      const minValue = min(
        filteredData.flatMap((series) => series.values),
        (d) => d.value
      );

      function ridge(d) {
        return (d - minValue + 1) / (maxValue - minValue + 1);
      }

      svg.select(".y-axis").selectAll("*").remove();
      svg
        .select(".y-axis")
        .join("g")
        .attr("transform", `translate(${ml - 10},${y.bandwidth() / 2})`)
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
        .attr("stroke", (d, i) => colorScale(i))
        .attr("stroke-width", 1.5)
        .attr("d", (series) =>
          line()
            .x((d: any, i: number) => x(Months[i]) + ml + x.bandwidth() / 2 || ml)
            .y((d: any) => y(series.name.split("|")[1]) + y.bandwidth() - ridge(d.value) * 45)(
            series.values
          )
        )
        .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
        .on("mousemove", tipHelpers.mousemove)
        .on("mouseleave", tipHelpers.mouseleave);
      const areaGenerator = area()
        .x((d, i) => x(Months[i]) + ml + x.bandwidth() / 2 || 0)
        .y1((d) => y(d.seriesName.split("|")[1]) + y.bandwidth() - ridge(d.value) * 45)
        .y0((d) => y(d.seriesName.split("|")[1]) + y.bandwidth());

      svg
        .select(".chart")
        .selectAll(".ridgeline-area")
        .data(filteredData)
        .join("path")
        .attr("class", "ridgeline-area")
        .attr("fill", (d, i) => colorScale(i))
        .attr("opacity", 0.5)
        .attr("stroke", "none")
        .attr("d", (series) =>
          areaGenerator(
            series.values.map((d) => ({
              value: d.value,
              seriesName: series.name
            }))
          )
        )
        .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
        .on("mousemove", tipHelpers.mousemove)
        .on("mouseleave", tipHelpers.mouseleave);

      svg
        .select(".heading")
        .selectAll("text")
        .data([key])
        .join("text")
        .attr("x", ml)
        .attr("y", y.bandwidth() - 10)
        .text((d) => d + " :")
        .style("font-size", "16.5px");

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
      svg.select(".heading").selectAll("*").remove();
      h = mt + mb + (data.length + traits.length) * 50;
      svg.attr("height", h + 30);

      svg.select(".y-axis").selectAll("*").remove();
      svg
        .select(".y-axis")
        .join("g")
        .attr("transform", `translate(${ml - 10},${y.bandwidth() / 2})`)
        .call(axisLeft(y).tickSize(0))
        .call((g) => g.select(".domain").remove());

      svg.selectAll(".y-axis .tick text").text((d) => d.split("|")[1]);
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
            .x((d: any, i: number) => x(Months[i]) + ml + x.bandwidth() / 2 || ml)
            .y(
              (d: any) =>
                y(series.name) + y.bandwidth() - ridge(d.value, series.name.split("|")[0]) * 45
            )(series.values)
        )
        .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
        .on("mousemove", tipHelpers.mousemove)
        .on("mouseleave", tipHelpers.mouseleave);

      const areaGenerator = area()
        .x((d, i) => x(Months[i]) + ml + x.bandwidth() / 2 || 0)
        .y1(
          (d) => y(d.seriesName) + y.bandwidth() - ridge(d.value, d.seriesName.split("|")[0]) * 45
        )
        .y0((d) => y(d.seriesName) + y.bandwidth());

      svg
        .select(".chart")
        .selectAll(".ridgeline-area")
        .data(data)
        .join("path")
        .attr("class", "ridgeline-area")
        .attr("fill", (d) => color(d.name.split("|")[0]))
        .attr("opacity", 0.5)
        .attr("stroke", "none")
        .attr("d", (series) =>
          areaGenerator(
            series.values.map((d) => ({
              value: d.value,
              seriesName: series.name
            }))
          )
        )
        .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
        .on("mousemove", tipHelpers.mousemove)
        .on("mouseleave", tipHelpers.mouseleave);

      svg
        .select(".heading")
        .selectAll("text")
        .data(traits)
        .join("text")
        .attr("x", ml)
        .attr("y", (d) => y(d) + y.bandwidth() - 10)
        .text((d) => d + " :")
        .style("font-size", "16.5px");

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
      .text((d) => abbreviateLabel(d, legendWidth / 13))
      .style("font-size", "13px");
  }, [containerRef, ro?.width, h, data]);

  const handleDownloadPng = async () => {
    if (!svgRef.current) return;
    try {
      const pngUrl = await toPng(svgRef.current, {
        backgroundColor: "#FFFFFF" // Ensure background is white
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = ".png";
      downloadLink.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      throw error;
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <svg width={ro?.width} height={h} ref={svgRef}>
        <g className="content">
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="chart" />
          <g className="heading" />
          <g className="legend"></g>
        </g>
      </svg>
      <div style={{ position: "absolute" }} className="tooltip" />
    </div>
  );
});

export default LineGraph;
