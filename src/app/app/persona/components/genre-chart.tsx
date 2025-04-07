"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const GenreGraph = ({
  chartData,
}: {
  chartData: { genre: string; count: number }[];
}) => {
  console.log("chartData", chartData);
  return (
    <ChartContainer config={chartConfig}>
      <RadarChart data={chartData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="genre" />
        <PolarGrid />
        <Radar
          dataKey="count"
          fill="var(--color-count)"
          fillOpacity={0.4}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
};
