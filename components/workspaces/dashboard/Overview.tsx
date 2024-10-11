// Assuming you have a data file, you might need to adjust this import
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { TbTrendingDown, TbTrendingUp } from "react-icons/tb";

import { title } from "@/components/primitives";
import { data } from "@/lib/data";

export const StackedCards = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col">
          <h1
            className={title({
              size: "h4",
            })}
          >
            Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize your main activities data
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className={title({ size: "h6" })}>New Orders</h1>
              <TbTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">{data[3].Primary * 230}</div>
              <p className="text-xs text-muted-foreground">
                +32% from last month
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className={title({ size: "h6" })}>New Customers</h1>
              <TbTrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">{data[3].Accent * 100}</div>
              <p className="text-xs text-muted-foreground">
                -15% from last month
              </p>
            </CardBody>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className={title({ size: "h6" })}>Total Revenue</h1>
              <TbTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">${data[3].Accent * 1000}</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};
