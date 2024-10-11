"use client";

import { StackedAreaChart } from "@/components/workspaces/dashboard/StackedAreas";
import { Traffic } from "@/components/workspaces/dashboard/Traffic";
import { TwoAreasChart } from "@/components/workspaces/dashboard/AreaCharts";
import { SimpleBarChart } from "@/components/workspaces/dashboard/BarChart";
import { StackedCards } from "@/components/workspaces/dashboard/Overview";
import Orders from "@/components/workspaces/dashboard/OrdersTable";

export default function Content() {
  return (
    <div className="relative min-h-full w-full">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 lg:gap-6 p-4">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Aperçu</h1>
          </div>
          <div className="space-y-6">
            <StackedCards />
            <div className="grid gap-6 lg:grid-cols-2">
              <TwoAreasChart />
              <SimpleBarChart />
              <Traffic />
              <StackedAreaChart />
            </div>
            <Orders />
          </div>
        </main>
      </div>
    </div>
  );
}
