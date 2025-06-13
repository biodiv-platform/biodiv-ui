import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { tooltipHelpers, useTooltip } from "@components/charts/hooks/use-tooltip";
import { hierarchy, treemap } from "d3-hierarchy";
import { scaleSequential } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { toPng } from "html-to-image";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { TaxonTreeTooltipRendered } from "./static-data";

interface TreeMapProps {
  h?: number;
  w?: number;
  data: any[];
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  loadMore;
  currentParent: string;
  currentDataPath;
  decrease;
}

const TreeMapChart = forwardRef(
  ({ data, w = 500, h = 400, mt = 30, mr = 30, mb = 30, ml = 30 ,loadMore, currentParent, currentDataPath, decrease}: TreeMapProps, ref) => {
    const [color, setColor] = useState("");
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

      const depth = currentParent.split(".").length;
      let children = Object.fromEntries(
        Object.entries(data).filter(([key]) => {
          const parts = key.split(".");
          return parts.length === depth + 1 && key.includes(currentParent.split("|")[1]); // No dots (length 1) or one dot (length 2)
        })
      );
      children = Object.entries(children).map((child) => ({ name: child[0], value: child[1] }));
      const treeData = {
        name: currentParent,
        children: children
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
      let colors = Array.from({ length: children.length }, (_, i) => colorScale(i));
      if (color != "") {
        colors = colors.filter((c) => c !== color);
        colors.unshift(color);
      }
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
        .attr("fill", (d, i) => colors[i])
        .attr("stroke", "black") // Set border color
        .attr("stroke-width", 0.5)
        .on("mouseover", (event, d) => tipHelpers.mouseover(event, { data: d }))
        .on("mousemove", tipHelpers.mousemove)
        .on("mouseleave", tipHelpers.mouseleave)
        .on("click", (event, d) => {
          if (Object.entries(children).length != 0) {
            const c = children
              .sort((a, b) => b.value - a.value)
              .findIndex((child) => child.name === d.data.name);
            loadMore(d.data.name);
            setColor(colors[c]);
          }
        });

      svg
        .select(".chart")
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", (d) => d.x0 + ml + (d.x1 - d.x0) / 2) // Center text horizontally
        .attr("y", (d) => d.y0 + mt + (d.y1 - d.y0) / 2) // Center text vertically
        .attr("text-anchor", "middle") // Align text to center
        .attr("dy", "0.35em") // Adjust vertical alignment
        .html(function (d) {
          // Example text with <i> tags, replace with actual data
          const textData = d.data.name.split("|")[0];

          // Define maxChars based on rectangle width
          const rectWidth = d.x1 - d.x0;
          const maxChars = Math.floor(rectWidth / 7); // Adjust character width factor as needed

          // Parse the text into parts with <i> tags and remove empty strings
          const parts = textData.split(/(<i>|<\/i>)/).filter((part) => part !== "");

          // Re-parse the truncated text to apply italics
          let isItalic = false;
          let charCount = 0;

          return parts
            .map((part) => {
              if (part === "<i>") {
                isItalic = true;
                return ""; // Ignore <i> tags themselves
              } else if (part === "</i>") {
                isItalic = false;
                return ""; // Ignore </i> tags themselves
              } else {
                // Check if remaining chars exceed maxChars
                if (charCount >= maxChars) return ""; // Stop if maxChars reached

                // Slice the part based on remaining character limit
                const slice = part.slice(0, maxChars - charCount);
                charCount += slice.length;

                return `<tspan style="font-style: ${
                  isItalic ? "italic" : "normal"
                };">${slice}</tspan>`;
              }
            })
            .join("");
        })
        .style("fill", "white") // Set text color
        .style("font-size", (d) => {
          const rectHeight = d.y1 - d.y0;
          return rectHeight > 20 ? "12px" : "8px"; // Adjust based on rectangle height
        });

      const rootText = svg
        .selectAll(".root-title")
        .data([parent])
        .join("text")
        .attr("class", "root-title")
        .attr("x", w / 2) // Center the text
        .attr("y", mt / 2) // Position the text
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#3182CE")
        .style("font-weight", "bold");

      rootText
        .selectAll("tspan")
        .data(currentDataPath)
        .join("tspan")
        .attr("class", (d, i) => `part-${i}`)
        .style("cursor", "pointer")
        .text((d, i) => {
          const parts = d
            .split("|")[0]
            .split(/(<i>|<\/i>)/)
            .filter((part) => part !== "");
          const plainText = parts.join("").replace(/<i>|<\/i>/g, "");
          return i === 0 ? plainText : ` / ${plainText}`;
        })
        .on("click", function (event, d) {
          decrease(d)
          //setCurrentParent(d);
          //setCurrentDataPath(currentDataPath.slice(0, currentDataPath.indexOf(d) + 1));
          setColor("");
        });
    }, [containerRef, ro?.width, h, data, currentParent]);

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
