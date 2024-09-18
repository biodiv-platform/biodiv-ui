
import React from "react";

import CalendarHeatmap from "./calendar-heatmap";
import { ObservationTooltipRenderer } from "./static-data";
import useCountPerDay from "./use-count-per-day";

const ObservationPerDay = ({ filter }) => {

  const count = useCountPerDay({ filter });

  const data = count.data.list;
  const isLoading = count.data.isLoading;
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const years = Object.keys(data);
  years.reverse()

  return (
    <div style={{display:"flex", overflowX:"auto", whiteSpace:"nowrap", scrollbarWidth:"thin",paddingTop:"20px"}}>
      {years.map((year)=>(
        <div style={{paddingTop:"30px"}}>
        <CalendarHeatmap h={365} data={data[year]} tooltipRenderer={ObservationTooltipRenderer} year={year} />
        </div>
      ))}
    </div>
  );
};

export default ObservationPerDay;