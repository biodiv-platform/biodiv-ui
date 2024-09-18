
import React, { useState } from "react";
import useCountPerDay from "./use-count-per-day";
import { ObservationTooltipRenderer } from "./static-data";
import CalendarHeatmap from "./calendar-heatmap";

const ObservationPerDay = ({ observationData, filter }) => {
  const [activeTab, setActiveTab] = useState(0);

  const count = useCountPerDay({ filter });

  const containerStyle = {
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'thin',
  };

  const data = count.data.list;
  const isLoading = count.data.isLoading;
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const years = Object.keys(data);
  const activeTabButtonStyle = {
    backgroundColor: "#00A36C",
    height:"40px",width:"100%",
  };
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