"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

// Assuming you have a data file, you might need to adjust this import
import { title } from "@/components/primitives";
import { data } from "@/lib/data";

export const StackedAreaChart = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col">
          <h4
            className={title({
              size: "h4",
            })}
          >
            New Customers
          </h4>
          <p className="text-small text-default-500">
            New users by First user primary channel group (Default Channel
            Group)
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="h-[400px]">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data}>
              <CartesianGrid
                className="stroke-default-300"
                strokeDasharray="3 3"
              />
              <XAxis className="text-small" dataKey="name" />
              <YAxis className="text-small" />
              <Tooltip />
              <Area
                dataKey="Neutral"
                fill="#8884d8"
                stackId="1"
                stroke="#8884d8"
                type="monotone"
              />
              <Area
                dataKey="Gray"
                fill="#82ca9d"
                stackId="1"
                stroke="#82ca9d"
                type="monotone"
              />
              <Area
                dataKey="Primary"
                fill="#ffc658"
                stackId="1"
                stroke="#ffc658"
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
