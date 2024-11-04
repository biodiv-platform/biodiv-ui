import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { tooltipHelpers, useTooltip } from "@components/charts/hooks/use-tooltip";
import { hierarchy, treemap } from "d3-hierarchy";
import { scaleSequential } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { toPng } from "html-to-image";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { TaxonTreeTooltipRendered } from "./static-data";

interface TreeMapProps {
  h?: number;
  w?: number;
  data: any[];
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
}

const TreeMapChart = forwardRef(
  ({ data, w = 500, h = 400, mt = 30, mr = 30, mb = 30, ml = 30 }: TreeMapProps, ref) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const ro = useResizeObserver(containerRef);
    const tip = useTooltip(containerRef);

    const tipHelpers = tooltipHelpers(tip, TaxonTreeTooltipRendered, 10, -50);

    useImperativeHandle(ref, () => ({
      downloadChart() {
        handleDownloadPng();
      }
    }));

    useEffect(() => {
      if (!ro?.width) {
        return;
      }

      const svg = select(svgRef.current);

      w = ro.width;
      const width = w - ml - mr;
      const height = h - mt - mb;

      svg
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("transform", `translate(${ml},${mt})`);

      svg.select(".content").attr("transform", `translate(${ml},${mt})`);

      function format(d) {
        const formattedLabel = d.split("|")[0].charAt(0).toUpperCase() + d.split("|")[0].slice(1);
        return formattedLabel;
      }

      function zoomIn(parent, dataPath) {
        const depth = parent.split(".").length;

        const children = Object.fromEntries(
          Object.entries(data).filter(([key]) => {
            const parts = key.split(".");
            return parts.length === depth + 1 && key.includes(parent.split("|")[1]); // No dots (length 1) or one dot (length 2)
          })
        );

        const treeData = {
          name: parent,
          children: Object.entries(children).map((child) => ({ name: child[0], value: child[1] }))
        };

        const root = hierarchy(treeData)
          .sum((d) => d.value)
          .sort((a, b) => (b.value || 0) - (a.value || 0));

        const Treemap = treemap().size([width, height]).padding(1).round(true);

        Treemap(root);

        const colorScale = scaleSequential(interpolateSpectral).domain([
          0,
          Object.entries(children).length - 1
        ]);

        svg.select(".chart").selectAll("*").remove();

        svg
          .select(".chart")
          .selectAll("rect")
          .data(root.leaves())
          .join("rect")
          .attr("x", (d) => d.x0 + ml) // Use d.x0 for x position
          .attr("y", (d) => d.y0 + mt) // Use d.y0 for y position
          .attr("width", (d) => d.x1 - d.x0) // Calculate width
          .attr("height", (d) => d.y1 - d.y0) // Calculate height
          .attr("fill", (d, i) => colorScale(i))
          .attr("stroke", "black") // Set border color
          .attr("stroke-width", 0.5)
          .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
          .on("mousemove", tipHelpers.mousemove)
          .on("mouseleave", tipHelpers.mouseleave)
          .on("click", (event, d) => zoomIn(d.data.name, dataPath.concat(d.data.name)));

        svg
          .selectAll("clipPath")
          .data(root.leaves())
          .join("clipPath")
          .attr("id", (d) => `clip-${d.data.name}`)
          .append("rect")
          .attr("x", (d) => d.x0 + ml)
          .attr("y", (d) => d.y0 + mt)
          .attr("width", (d) => d.x1 - d.x0)
          .attr("height", (d) => d.y1 - d.y0);

        svg
          .select(".chart")
          .selectAll("text")
          .data(root.leaves())
          .join("text")
          .attr("x", (d) => d.x0 + ml + 3) // Add padding from left
          .attr("y", (d) => d.y0 + mt + 15) // Position near top of rectangle
          .attr("clip-path", (d) => `url(#clip-${d.data.name})`)
          .selectAll("tspan")
          .data((d) => {
            // Split name into lines (based on spaces and capital letters), add value as last line
            const lines = format(d.data.name).split(/(?=[A-Z][a-z])|\s+/g);
            return lines;
          })
          .join("tspan")
          .attr("x", (d) => d.x0 + ml + 3) // Align tspan to rectangle padding
          .attr("y", (d, i) => `${d.y0 + mt + 12 + i * 12}`) // Space out lines vertically
          .attr("fill", "white") // Opacity for value line
          .text((d) => d);

        const path = parent.replaceAll(".", "/");
        svg.select(".root-title").selectAll("*").remove();
        svg.select(".tspan").selectAll("*").remove();

        const rootText = svg
          .selectAll(".root-title")
          .data([path])
          .join("text")
          .attr("class", "root-title")
          .attr("x", w / 2) // Center the text
          .attr("y", mt / 2) // Position the text
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("fill", "black")
          .style("font-weight", "bold");

        rootText
          .selectAll("tspan")
          .data(dataPath)
          .join("tspan")
          .attr("class", (d, i) => `part-${i}`)
          .style("cursor", "pointer")
          .text((d, i) => (i === 0 ? format(d) : `/${format(d)}`))
          .on("click", function (event, d) {
            // Update part on click, for example, toggle between original and "clicked" text
            zoomIn(d, dataPath.slice(0, dataPath.indexOf(d) + 1));
          });
      }

      const children = Object.fromEntries(
        Object.entries(data).filter(([key]) => {
          const parts = key.split(".");
          return parts.length === 2; // No dots (length 1) or one dot (length 2)
        })
      );

      const treeData = {
        name: "Root",
        children: Object.entries(children).map((child) => ({ name: child[0], value: child[1] }))
      };

      const root = hierarchy(treeData)
        .sum((d) => d.value)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      const Treemap = treemap().size([width, height]).padding(1).round(true);

      Treemap(root);

      const dataPath = ["Root|1"];

      const colorScale = scaleSequential(interpolateSpectral).domain([
        0,
        Object.entries(children).length - 1
      ]);

      svg
        .select(".chart")
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr("x", (d) => d.x0 + ml) // Use d.x0 for x position
        .attr("y", (d) => d.y0 + mt) // Use d.y0 for y position
        .attr("width", (d) => d.x1 - d.x0) // Calculate width
        .attr("height", (d) => d.y1 - d.y0) // Calculate height
        .attr("fill", (d, i) => colorScale(i))
        .attr("stroke", "black") // Set border color
        .attr("stroke-width", 0.5)
        .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
        .on("mousemove", tipHelpers.mousemove)
        .on("mouseleave", tipHelpers.mouseleave)
        .on("click", (event, d) => zoomIn(d.data.name, dataPath.concat(d.data.name)));

      svg
        .selectAll("clipPath")
        .data(root.leaves())
        .join("clipPath")
        .attr("id", (d) => `clip-${d.data.name}`)
        .append("rect")
        .attr("x", (d) => d.x0 + ml)
        .attr("y", (d) => d.y0 + mt)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);

      svg
        .select(".chart")
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", (d) => d.x0 + ml + 3) // Add padding from left
        .attr("y", (d) => d.y0 + mt + 15) // Position near top of rectangle
        .attr("clip-path", (d) => `url(#clip-${d.data.name})`)
        .selectAll("tspan")
        .data((d) => {
          // Split name into lines (based on spaces and capital letters), add value as last line
          const lines = format(d.data.name).split(/(?=[A-Z][a-z])|\s+/g);
          return lines;
        })
        .join("tspan")
        .attr("x", (d) => d.x0 + ml + 3) // Align tspan to rectangle padding
        .attr("y", (d, i) => `${d.y0 + mt + 12 + i * 12}`) // Space out lines vertically
        .attr("fill", "white") // Opacity for value line
        .text((d) => d);
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
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="chart" />
        </svg>
        <div className="tooltip" />
      </div>
    );
  }
);

export default TreeMapChart;
