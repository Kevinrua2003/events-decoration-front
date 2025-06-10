"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getEvents } from "@/api/events/main";
import { EventType } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
  ammount: {
    label: "Events: ",
    color: "#2563eb",
  },
};

const categories: EventType[] = Object.values(EventType);

function generateColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 * i) / count);
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
}

const dynamicColors = generateColors(categories.length);

const eventTypeColors: { [key in EventType]: string } = categories.reduce(
  (acc, type, index) => {
    acc[type] = dynamicColors[index];
    return acc;
  },
  {} as Record<EventType, string>
);

const calculateAmmount = async (type: EventType): Promise<number> => {
  const events = await getEvents();
  return events.reduce((acc, item) => (item.type === type ? acc + 1 : acc), 0);
};

interface ChartItem {
  type: string;
  ammount: number;
}

function EventsChart() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await Promise.all(
        categories.map(async (cat) => ({
          type: cat,
          ammount: await calculateAmmount(cat),
        }))
      );
      setChartData(data);
    }
    loadData();
  }, []);

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full p-4 bg-white shadow rounded-lg">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="type"
            tick={{ fill: "#555", fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
          <Bar dataKey="ammount" radius={4} animationDuration={800}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={eventTypeColors[entry.type as EventType]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default EventsChart;
