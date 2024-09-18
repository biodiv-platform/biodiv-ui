export const StatesChartMeta = {
  titleKey: "stateName",
  countKey: "observations",
  hideXAxis: true
};

export const SpeciesTooltipRenderer = (data) =>
  `<b>${data?.sgroup}</b><br/>
    <nobr>${data?.count}</nobr><br/>
   `;

export const ObservationTooltipRenderer = (data) =>
  `<b>${data?.date}</b><br/>
  <nobr>count:${data?.value}</nobr><br/>`;
