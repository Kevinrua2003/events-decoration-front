"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { EventType } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  ammount: {
    label: "Eventos",
    color: "#171717",
  },
};

const eventTypeColors: Record<string, string> = {
  [EventType.BIRTHDAY]: "#f97316",
  [EventType.CORPORATE]: "#3b82f6",
  [EventType.WEDDING]: "#ec4899",
  [EventType.OTHER]: "#737373",
};

const typeLabels: Record<string, string> = {
  [EventType.BIRTHDAY]: 'Cumpleaños',
  [EventType.CORPORATE]: 'Corporativo',
  [EventType.WEDDING]: 'Boda',
  [EventType.OTHER]: 'Otro',
};

interface ChartItem {
  type: string;
  ammount: number;
}

interface EventsChartProps {
  initialData?: Record<string, number>;
}

function EventsChart({ initialData }: EventsChartProps) {
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  const chartDataMemo = useMemo(() => {
    if (initialData) {
      return Object.entries(initialData).map(([type, count]) => ({
        type: typeLabels[type] || type,
        ammount: count,
      }));
    }
    return [];
  }, [initialData]);

  useEffect(() => {
    setChartData(chartDataMemo);
  }, [chartDataMemo]);

  const hasData = chartData.some(d => d.ammount > 0);

  if (!initialData) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="type"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="ammount" radius={3} fill="#171717" animationDuration={500}>
            {chartData.map((entry, index) => {
              const originalType = Object.keys(typeLabels).find(key => typeLabels[key] === entry.type);
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={eventTypeColors[originalType || ''] || "#737373"}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default EventsChart;
