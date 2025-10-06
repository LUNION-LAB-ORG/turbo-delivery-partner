"use client";

import { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import { Input, Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import { AreaChart, CartesianGrid, XAxis, Area } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Search } from "lucide-react";
import { InWorking } from '@/components/commons/InWorking';
import { PageResponse, CommandeExterne } from "@/src/actions/commandes.actions";
import { auth } from "@/auth";
import Orders from "./components/orders";

const orderState = [
    { id: "all", name: "Toutes" },
    { id: "EN_ATTENTE_RECUPERATION", name: "En attente" },
    { id: "TERMINER", name: "Terminées" },
    { id: "ANNULER", name: "Annulées" },
];

const chartConfig = {
    orders: {
        label: "Commandes",
        color: "hsl(var(--chart-3))",
    },
};

export default function Content({ commandesInitiales, session }: { commandesInitiales: PageResponse<CommandeExterne> | null, session: any }) {
    const [commandes, setCommandes] = useState<PageResponse<CommandeExterne> | null>(commandesInitiales);

    return (
        <div className="w-full h-full flex flex-1 flex-col gap-4 lg:gap-6 mb-10">
            <div className="flex items-center">
                <h1 className={title({ size: "h3", class: "text-primary" })}>Commandes</h1>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-4 justify-center">
                <Card className="w-full col-span-12 rounded-md" shadow="sm">
                    <CardBody>
                        <Orders commandesInitiales={commandes} session={session} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}