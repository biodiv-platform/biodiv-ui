export const ChartMeta = {
  groupKey: "group",
  subGroupKeys: ["uploaded", "identified"],
  subGroupColors: ["#E53E3E", "#3182CE"]
};

export const TooltipRenderer = (data) => {
  return `<b>${data[ChartMeta.groupKey]}</b><br/>
  <nobr>Identified: ${data?.identified}</nobr><br/>
  <nobr>Uploaded: ${data?.uploaded}</nobr>`;
};
