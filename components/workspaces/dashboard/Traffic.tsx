"use client";
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

import { title } from "@/components/primitives";

const barData = [
  { name: "Direct", data: 9000 },
  { name: "Organic Search", data: 5000 },
  { name: "Referral", data: 4000 },
  { name: "Organic Social", data: 3000 },
  { name: "Organic Video", data: 2000 },
  { name: "Other", data: 1000 },
];

export const Traffic = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col">
          <h4
            className={title({
              size: "h4",
            })}
          >
            Website Traffic
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
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="data" fill="#8884d8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
