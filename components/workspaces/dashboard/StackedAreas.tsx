"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";

// Assuming you have a data file, you might need to adjust this import
import { title } from "@/components/primitives";
import { data } from "@/lib/data";
import ComponentsChartsArea from "@/components/charts/components-charts-area";

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
            Nouveaux utilisateurs
          </h4>
          <p className="text-small text-default-500">
            Nouveaux utilisateurs par canal principal (Canal principal par défaut)
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <ComponentsChartsArea />
      </CardBody>
    </Card>
  );
};
