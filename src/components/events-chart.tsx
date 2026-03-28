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
} from "recharts";
import { getEvents } from "@/api/events/main";
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

const categories: EventType[] = Object.values(EventType);

const eventTypeColors: Record<EventType, string> = {
  [EventType.BIRTHDAY]: "#f97316",
  [EventType.CORPORATE]: "#3b82f6",
  [EventType.WEDDING]: "#ec4899",
  [EventType.OTHER]: "#737373",
};

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await Promise.all(
        categories.map(async (cat) => ({
          type: cat === EventType.BIRTHDAY ? 'Cumpleaños' : 
                cat === EventType.CORPORATE ? 'Corporativo' :
                cat === EventType.WEDDING ? 'Boda' : 'Otro',
          ammount: await calculateAmmount(cat),
        }))
      );
      setChartData(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-[250px]">
      {loading ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          Cargando...
        </div>
      ) : chartData.every(d => d.ammount === 0) ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No hay datos para mostrar
        </div>
      ) : (
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
                  const originalType = categories[index];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={eventTypeColors[originalType] || "#737373"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
}

export default EventsChart;
