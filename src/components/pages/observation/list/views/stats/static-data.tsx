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
  `<b>${data?.date.split("-").reverse().join("/")}</b><br/>
  <nobr>count:${data?.value}</nobr><br/>`;

export const TraitsTooltipRenderer = (data) =>
  `<b>${data.name}</b><br/>
   <nobr>Jan:${data.values[0].value}, Feb:${data.values[1].value}, Mar:${data.values[2].value}, Apr:${data.values[3].value}, May:${data.values[4].value}, Jun:${data.values[5].value},<nobr/>
   <nobr>Jul:${data.values[6].value}, Aug:${data.values[7].value}, Sep:${data.values[8].value}, Oct:${data.values[9].value}, Nov:${data.values[10].value}, Dec:${data.values[11].value}<nobr/>
    `;
