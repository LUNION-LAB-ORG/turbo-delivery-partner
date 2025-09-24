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

                {/* <Card className="w-full col-span-12 rounded-md" shadow="sm">
                    <CardBody>
                        <CardHeader>
                            <h2 className="text-xl font-bold text-red-500">Progression Hebdomadaire</h2>
                        </CardHeader>
                        <ChartContainer config={chartConfig} className="w-full">
                            <AreaChart
                                accessibilityLayer
                                data={[]}
                                margin={{ left: 12, right: 12 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                <Area dataKey="orders" type="natural" fill="hsl(var(--chart-1))" fillOpacity={0.4} stroke="hsl(var(--primary))" />
                            </AreaChart>
                        </ChartContainer>
                    </CardBody>
                </Card> */}

                {/* <Card className="w-full col-span-12" shadow="sm">
                    <InWorking
                        titre="Notre Nouvelle Fonctionnalité Arrive Bientôt"
                        message="Notre équipe travaille actuellement sur cette page pour vous offrir une meilleure expérience"
                        datePrevue="1er Août 2025"
                        showDate={true}
                    />
                </Card> */}
            </div>
        </div>
    );
}