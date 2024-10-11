"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  CartesianGrid,
  YAxis,
} from "recharts";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

// Vous devrez ajuster cet import selon votre structure de projet
import { title } from "@/components/primitives";
import { data } from "@/lib/data";

export const TwoAreasChart = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start px-4 pt-4">
        <div className="flex flex-col">
          <h4
            className={title({
              size: "h4",
            })}
          >
            New Orders
          </h4>
          <p className="text-small text-default-500">
            Visualize your main activities data
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="w-full aspect-video">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data}>
              <YAxis
                axisLine={false}
                fontSize={12}
                tickLine={false}
                width={40}
              />
              <XAxis
                axisLine={false}
                dataKey="name"
                fontSize={12}
                height={20}
                tickLine={false}
              />
              <Tooltip />
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <Area
                dataKey="Gray"
                fill="#7828c8"
                fillOpacity={0.05}
                stroke="#7828c8"
                type="monotone"
              />
              <Area
                dataKey="Primary"
                fill="#006FEE"
                fillOpacity={0.1}
                stroke="#006FEE"
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
