import { Box, chakra } from "@chakra-ui/react";
import useResizeObserver from "@components/charts/hooks/use-resize-observer";
import { Months } from "@static/constants";
import { scaleBand, scaleLinear, scaleSequential } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";
import { stack } from "d3-shape";
import { toPng } from "html-to-image";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";

interface MonthYearRow {
  month: string;
  year: string;
  value: number;
}

interface StackedColumnChartProps {
  data: MonthYearRow[];
  h?: number;
}

const MARGIN = { top: 16, right: 8, bottom: 32, left: 64 };

const formatTick = new Intl.NumberFormat("en", { notation: "compact" }).format;

/**
 * Observations per month as vertical columns, one stacked segment per year. The year chips
 * below show a single year (with its counts on the columns) and "All" stacks them again
 */
const StackedColumnChart = forwardRef(function StackedColumnChart(
  { data, h = 320 }: StackedColumnChartProps,
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ro = useResizeObserver(containerRef);
  const [selectedYear, setSelectedYear] = useState<string>();

  const years = useMemo(
    () => Array.from(new Set(data.map(({ year }) => String(year)))).sort((a, b) => +a - +b),
    [data]
  );
  // a year picked before the data changed may not be in the new data
  const activeYear = selectedYear && years.includes(selectedYear) ? selectedYear : undefined;

  // same sequential scale as the horizontal chart, so years keep their colours across charts
  const colorOf = useMemo(() => {
    const domainMax = Math.ceil(1.5 * years.length);
    const scale = scaleSequential(interpolateYlGnBu).domain([0, domainMax]);
    return (year: string) => {
      const position = years.indexOf(year) + 1;
      return { fill: scale(position), isDark: position / domainMax > 0.5 };
    };
  }, [years]);

  const layers = useMemo(() => {
    const byMonth = Months.map((month) => ({ month } as Record<string, any>));
    for (const { month, year, value } of data) {
      const row = byMonth[Months.indexOf(month)];
      if (row) row[year] = (row[year] || 0) + (Number(value) || 0);
    }
    return stack<Record<string, any>>()
      .keys(activeYear ? [activeYear] : years)
      .value((row, key) => row[key] || 0)(byMonth);
  }, [data, years, activeYear]);

  const toDataUrl = () =>
    toPng(containerRef.current as HTMLDivElement, { backgroundColor: "#FFFFFF" });

  const downloadPng = async () => {
    if (!containerRef.current) return;
    const link = document.createElement("a");
    link.href = await toDataUrl();
    link.download = "temporal-distribution.png";
    link.click();
  };

  const getBase64PNG = async () => {
    if (!containerRef.current) return null;
    try {
      return (await toDataUrl()).split(",")[1];
    } catch (error) {
      console.error("Error in getBase64PNG:", error);
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    downloadChart: () => downloadPng(),
    getBase64: () => getBase64PNG()
  }));

  const width = ro?.width || 0;
  const innerW = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const innerH = h - MARGIN.top - MARGIN.bottom;

  const x = scaleBand().domain(Months).range([0, innerW]).padding(0.25);
  const topOfColumns = Math.max(1, ...(layers.at(-1)?.map(([, top]) => top) || []));
  const y = scaleLinear().domain([0, topOfColumns]).nice().range([innerH, 0]);
  const monthFontSize = innerW < 420 ? 10 : 13;

  return (
    <div ref={containerRef}>
      <svg width={width} height={h} role="img" aria-label="Observations per month">
        {width > 0 && (
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {y.ticks(5).map((tick) => (
              <g key={tick} transform={`translate(0,${y(tick)})`}>
                <line x2={innerW} stroke="#EDF2F7" />
                <text x={-8} dy="0.32em" textAnchor="end" fontSize={12} fill="#4A5568">
                  {formatTick(tick)}
                </text>
              </g>
            ))}
            <text
              transform="rotate(-90)"
              x={-innerH / 2}
              y={-MARGIN.left + 14}
              textAnchor="middle"
              fontSize={12}
              fill="#4A5568"
            >
              Number of observations
            </text>

            {layers.map((layer) => (
              <g key={layer.key} fill={colorOf(layer.key).fill}>
                {layer.map(([bottom, top], i) =>
                  top > bottom ? (
                    <rect
                      key={Months[i]}
                      x={x(Months[i])}
                      y={y(top)}
                      width={x.bandwidth()}
                      height={y(bottom) - y(top)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                    >
                      <title>{`${Months[i]} ${layer.key}: ${(
                        top - bottom
                      ).toLocaleString()}`}</title>
                    </rect>
                  ) : null
                )}
              </g>
            ))}

            {activeYear &&
              layers[0]?.map(([, top], i) =>
                top ? (
                  <text
                    key={Months[i]}
                    x={(x(Months[i]) || 0) + x.bandwidth() / 2}
                    y={y(top) - 4}
                    textAnchor="middle"
                    fontSize={11}
                    fill="#2D3748"
                  >
                    {top.toLocaleString()}
                  </text>
                ) : null
              )}

            <line y1={innerH} y2={innerH} x2={innerW} stroke="#A0AEC0" />
            <line y2={innerH} stroke="#A0AEC0" />
            {Months.map((month) => (
              <text
                key={month}
                x={(x(month) || 0) + x.bandwidth() / 2}
                y={innerH + 20}
                textAnchor="middle"
                fontSize={monthFontSize}
                fill="#2D3748"
              >
                {month}
              </text>
            ))}
          </g>
        )}
      </svg>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(3.25rem, 1fr))"
        gap="2px"
        mt={3}
        fontSize="13px"
      >
        {years.map((year) => {
          const { fill, isDark } = colorOf(year);
          return (
            <YearChip
              key={year}
              label={year}
              bg={fill}
              color={isDark ? "white" : "gray.800"}
              selected={year === activeYear}
              onClick={() => setSelectedYear(year)}
            />
          );
        })}
        <YearChip
          label="All"
          bg="gray.100"
          color="gray.800"
          selected={!activeYear}
          onClick={() => setSelectedYear(undefined)}
        />
      </Box>
    </div>
  );
});

function YearChip({ label, bg, color, selected, onClick }) {
  return (
    <chakra.button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      bg={bg}
      color={color}
      py="2px"
      textAlign="center"
      cursor="pointer"
      fontWeight={selected ? "bold" : "normal"}
      outline={selected ? "2px solid" : "none"}
      outlineColor="gray.700"
      outlineOffset="-2px"
    >
      {label}
    </chakra.button>
  );
}

export default StackedColumnChart;
