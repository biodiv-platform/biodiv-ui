import { Button } from "@chakra-ui/react";
import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import * as d3 from "d3";
import { axisLeft } from "d3-axis";
import { scaleBand, scaleLinear,scaleSequential } from "d3-scale";
import {interpolateYlGnBu} from "d3-scale-chromatic";
import { select } from "d3-selection";
import {stack} from "d3-shape";
import React, { useEffect, useRef } from "react";

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

export default function StackedHorizontalChart({
  h = 500,

  mt = 10,
  mr = 64,
  mb = 20,
  ml = 60,
  data,
  barPadding = 0.2,
  leftOffset = 0
}: HorizontalBarChartProps) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const ro = useResizeObserver(containerRef);
  

  useEffect(() => {
    if (!ro?.width || !data.length) return;

    const svg = select(svgRef.current).attr("width", ro.width).attr("height", h+30);

    svg.select(".content").attr("transform", `translate(${ml},${mt})`);

    const groups = Array.from(new Set(data.map((sg) => sg.month)));

    const years = Array.from(new Set(data.map((sg) => sg.year)));

    const colorScale = scaleSequential(interpolateYlGnBu)
    .domain([0, years.length+8]);

    const colors = Array.from({ length: years.length+1 }, (_, i) => colorScale(i));

    const series = Array.from(
      d3.rollup(
        data,
        v => Object.fromEntries(v.map(d => [d.year, d.value])), 
        d => d.month 
      ),
      ([month, years]) => ({ month, ...years }) 
    );

    const max = Math.max(
      ...series.map((o) => years.map((k) => o[k] ?? 0).reduce((a, b) => a + b, 0))
    );

    const x: any = scaleLinear()
    .domain([0, max])
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
    

    const seriesData = stack().keys(years)(series)

    function yPos (d) {
        return y(d.data.month)
    }
    
    svg
    .select(".chart")
    .selectAll("g")
    .data(seriesData)
    .join("g")
    .attr("fill", (d)=>colors[d.index+1])
    .selectAll("rect")
    // second time loop per subgroup to add all rectangles
    .data((d) => d)
    .join("rect")
    .attr("x", (d)=>x(d[0]))
    .attr("y", (d) => yPos(d))
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d[1]) - x(d[0]))
    .attr("stroke", "red")
    .attr("stroke-width", 0.2);

    const legendWidth = (ro.width - ml - mr)/(years.length+1)

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function handleLegendClick(key,ro) {
      const filteredData= seriesData.filter((series) => series.key === key)

      const maxValue = d3.max(filteredData, series => 
        d3.max(series, d => d[1]-d[0])  // Access the end value of the stack
      );

      const xValue: any = scaleLinear()
    .domain([0, maxValue])
    .range([0, ro.width - ml - mr]);

      svg
    .select(".chart")
    .selectAll("g")
    .data(filteredData)
    .join("g")
    .attr("fill", (d) => colors[d.index + 1])  // Keep color consistent
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", xValue(0))
    .attr("y", (d) => yPos(d))
    .attr("height", y.bandwidth())
    .attr("width", (d) => xValue(d[1]) - xValue(d[0]))
    .attr("stroke", "red")
    .attr("stroke-width", 0.2);

    svg
      .select(".chart")
      .join("g")
      .data(filteredData)
      .selectAll("text")
      .data((d)=> d)
      .join("text")
      .attr("font-size", 10)
      .attr("class", "legend-text")
      .attr("y", (d) => yPos(d)+(y.bandwidth()/2)+5)
      .attr("x", (d) => xValue(d[1])-xValue(d[0])+10)
      .text((d) => d[1]-d[0]);
    }

    function handleReset() {

      svg
    .select(".chart")
    .selectAll("g")
    .data(seriesData)
    .join("g")
    .attr("fill", (d)=>colors[d.index+1])
    .selectAll("rect")
    // second time loop per subgroup to add all rectangles
    .data((d) => d)
    .join("rect")
    .attr("x", (d)=>x(d[0]))
    .attr("y", (d) => yPos(d))
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d[1]) - x(d[0]))
    .attr("stroke", "red")
    .attr("stroke-width", 0.2);

    svg.selectAll(".legend-text").remove()
    }

    const legend = svg.select(".legend")
            .attr('transform', `translate(${-ml}, ${h-mt-mb+10})`);

            legend.selectAll('rect')
            .data(years)
            .join("rect")
            .attr('x', (d, i) => i * legendWidth+ml)
            .attr('y', 0)
            .attr('width', legendWidth-2)
            .attr('height', 20)
            .attr('fill', (d, i) => colors[i+1])
            .style("cursor", "pointer")
            .on("click", (event, d) => handleLegendClick(d,ro));

            const resetData = ["reset"];  // Single-element array for the reset rectangle
            legend.selectAll(".reset-rect")
              .data(resetData)
              .join("rect")  // Use join to create the rectangle if it doesn't exist
              .attr("class", "reset-rect")
              .attr("x", years.length*legendWidth+ml)
              .attr("y", 0)  // Position below the last legend item
              .attr("width", legendWidth-2)
              .attr("height", 20)
              .attr("fill", "#ccc")
              .style("cursor", "pointer")
              .on("click", () => handleReset());

            legend.selectAll('text')
            .data(years.concat("All"))
            .join('text')
            .attr('x', (d, i) => i * legendWidth+ml+5)
            .attr('y', 35)
            .text(d => d)
            .style('font-size', "13px");
  }, [containerRef, ro?.width, h, data]);

  const handleDownloadPng = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    if(!ro) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = ro?.width; // Default to 200 if not set
    canvas.height = h+30;

    context.fillStyle = 'lightgray'; // Your desired background color
    context.fillRect(0, 0, canvas.width, canvas.height); // Fill the background

    // Create a data URL for the SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Draw the SVG onto the canvas
      context.drawImage(img, 0, 0);

      // Convert the canvas to a data URL and trigger download
      const pngDataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngDataUrl;
      downloadLink.download = 'image.png'; // The name for the downloaded file
      downloadLink.click(); // Trigger the download

      // Clean up the URL object
      URL.revokeObjectURL(url);
    };
    img.src = url; // Set the image source to the URL of the SVG blob
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
      <Button onClick={handleDownloadPng}>Download</Button>
    </div>
  );
}