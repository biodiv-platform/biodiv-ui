export const ChartMeta = {
  groupKey: "group",
  subGroupKeys: ["identified", "uploaded"],
  subGroupColors: ["#3182CE", "#E53E3E"]
};

export const TooltipRenderer = (data) => {
  return `<b>${data[ChartMeta.groupKey]}</b><br/>
      <nobr>Uploaded: ${data?.uploaded}</nobr><br/>
      <nobr>Identified: ${data?.identified}</nobr>`;
};
