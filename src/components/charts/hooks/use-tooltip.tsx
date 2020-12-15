import { pointer, select } from "d3-selection";

export const useTooltip = (ref) => {
  return select(ref?.current)
    .select(".tooltip")
    .join("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "50")
    .style("background-color", "#2D3748")
    .style("border-radius", "0.125rem")
    .style("padding", "4px 8px")
    .style("color", "white")
    .style("font-size", "0.875rem")
    .style("max-width", "320px")
    .style("box-shadow", "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)");
};

export function tooltipHelpers(tip, tooltipRenderer, leftOffset = 40, topOffset = 30) {
  const mousemove = function (e) {
    tip
      .style("left", pointer(e)[0] + leftOffset + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", pointer(e)[1] + topOffset + "px");
  };

  const mouseleave = () => tip.style("opacity", 0);

  const mouseover = (_, { data }) => tip.style("opacity", 1).html(tooltipRenderer(data));

  return { mousemove, mouseleave, mouseover };
}
