"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

// Vous devrez ajuster cet import selon votre structure de projet
import { title } from "@/components/primitives";
import { barData } from "@/lib/data";

export const SimpleBarChart = () => {
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
            <BarChart data={barData}>
              <YAxis
                axisLine={false}
                fontSize={12}
                tickLine={false}
                width={34}
              />
              <XAxis
                axisLine={false}
                dataKey="name"
                fontSize={12}
                height={20}
                tickLine={false}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Bar dataKey="Primary" fill="#006FEE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
