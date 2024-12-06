"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";

import { title } from "@/components/primitives";
import ComponentsChartsBar from "@/components/charts/components-charts-bar";

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
            Traffic du site web
          </h4>
          <p className="text-small text-default-500">
            Nouveaux utilisateurs par canal principal (Canal principal par défaut)
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <ComponentsChartsBar />
      </CardBody>
    </Card>
  );
};
