"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";

// Vous devrez ajuster cet import selon votre structure de projet
import { title } from "@/components/primitives";
import { data } from "@/lib/data";
import ComponentsChartsArea from "@/components/charts/components-charts-area";

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
            Visualisez les principales données liées à vos biens immobiliers
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <ComponentsChartsArea />
      </CardBody>
    </Card>
  );
};
