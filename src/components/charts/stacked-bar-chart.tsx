import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";
import { stack } from "d3-shape";
import { toPng } from "html-to-image";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import useResizeObserver from "./hooks/use-resize-observer";
import { tooltipHelpers, useTooltip } from "./hooks/use-tooltip";
import Legend from "./legend";

interface StackedBarChartProps {
  h?: number;

  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;

  barPadding?: number;
  rotateLabels?: boolean;

  data: any[];
  meta: { groupKey: string; subGroupKeys; subGroupColors };

  tooltipRenderer;
}

const StackedBarChart = forwardRef(
  (
    {
      h = 360,

      mt = 10,
      mr = 0,
      mb = 60,
      ml = 40,

      barPadding = 0.2,
      rotateLabels,

      data,
      meta: { groupKey, subGroupKeys, subGroupColors },

      tooltipRenderer
    }: StackedBarChartProps,
    ref
  ) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const ro = useResizeObserver(containerRef);

    // tooltip
    const tip = useTooltip(containerRef);
    const tipHelpers = tooltipHelpers(tip, tooltipRenderer);

    useImperativeHandle(ref, () => ({
      downloadChart() {
        handleDownloadPng();
      }
    }));

    useEffect(() => {
      if (!ro?.width || !data.length) return;

      // append the svg object to the body of the page
      const svg = select(svgRef.current).attr("width", ro.width).attr("height", h);

      svg.select(".content").attr("transform", `translate(${ml},${mt})`);

      const groups = data.map((o) => o[groupKey]);

      // Add X axis
      const x: any = scaleBand()
        .domain(groups)
        .range([0, ro.width - ml - mr])
        .padding(barPadding);

      svg
        .select(".x-axis")
        .join("g")
        .attr("transform", `translate(0,${h - mt - mb})`)
        .call(axisBottom(x).tickSizeOuter(0) as any);

      if (rotateLabels) {
        svg
          .select(".x-axis")
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-60)");
      }

      const max = Math.max(
        ...data.map((o) => subGroupKeys.map((k) => o[k]).reduce((a, b) => a + b, 0))
      );

      // Add Y axis
      const y: any = scaleLinear()
        .domain([0, max])
        .range([h - mt - mb, 0]);

      svg
        .select(".y-axis")
        .join("g")
        .call(axisLeft(y) as any);

      // one color per subgroup
      const color: any = scaleOrdinal().domain(subGroupKeys).range(subGroupColors);

      // stack per subgroup
      const stackedData = stack().keys(subGroupKeys)(data);

      // show the bars
      svg
        .select(".chart")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", (d) => color(d.key))
        .selectAll("rect")
        // second time loop per subgroup to add all rectangles
        .data((d) => d)
        .join("rect")
        .on("mouseover", tipHelpers.mouseover)
        .on("mousemove", tipHelpers.mousemove)
        .on("mouseleave", tipHelpers.mouseleave)
        .attr("x", (d) => x(d?.data?.group))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());
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
          </g>
        </svg>
        <div className="tooltip" />
        <Legend keys={subGroupKeys} colors={subGroupColors} />
      </div>
    );
  }
);

export default StackedBarChart;
