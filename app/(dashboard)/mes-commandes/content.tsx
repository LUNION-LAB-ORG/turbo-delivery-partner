"use client";

import { useState } from "react";
import Orders from "./components/orders";
import { Search } from "lucide-react";
import { title } from "@/components/primitives";
import { Input, Card, CardHeader, CardBody, Button, } from "@heroui/react";
import { PageResponse, CommandeExterne } from "@/src/actions/commandes.actions";
// Import icons as needed

const stats = [
    { label: "Commandes totales", value: 6 },
    { label: "En attente", value: 4 },
    { label: "En livraison", value: 4 },
    { label: "Validés", value: 0 },
    { label: "Terminées", value: 1 },
    { label: "Annulées", value: 1 },
];

const orderTabs = [
    { id: "all", name: "Toutes", color: "red" },
    { id: "new", name: "Nouvelle", color: "gray" },
    { id: "pending", name: "En attente", color: "orange" },
    { id: "ready", name: "Prêt", color: "green" },
    { id: "delivering", name: "En livraison", color: "blue" },
    { id: "finished", name: "Terminé", color: "purple" },
    { id: "cancelled", name: "Annulé", color: "red" },
];

export default function Content({ commandesInitiales, session }: { commandesInitiales: PageResponse<CommandeExterne> | null, session: any }) {
    const [commandes, setCommandes] = useState(commandesInitiales);
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    // Pour filtrer les commandes selon l’onglet actif
    // const filteredCommandes = commandesInitiales?.data?.filter((cmd: any) =>
    //     activeTab === "all" ? true : cmd.status === activeTab
    // );

    return (
        <div className="w-full h-full flex flex-col gap-6 mb-4">
            <div className="flex items-center">
                <h3 className={title({ size: "h3", class: "text-primary" })}>Mes Commandes</h3>
            </div>

            <div className="grid grid-cols-6 gap-2">
                {stats.map((stat) => (
                    <Card key={stat.label} className="col-span-1 text-center rounded-md py-2">
                        <span className="text-lg font-bold">{stat.value}</span>
                        <div className="text-[13px] text-gray-600">{stat.label}</div>
                    </Card>
                ))}
            </div>            

            <Card className="w-full rounded-md" shadow="sm">
                <CardHeader>
                    <div className="flex flex-wrap gap-2 my-2">
                        {orderTabs.map((tab) => (
                            <Button
                                key={tab.id}
                                color={activeTab === tab.id ? (tab.color as "primary" | "default" | "secondary" | "success" | "warning" | "danger") : "default"}
                                onClick={() => setActiveTab(tab.id)}
                                size="sm"
                                className="rounded-md"
                                variant={activeTab === tab.id ? "solid" : "ghost"}
                            >
                                {tab.name}
                            </Button>                
                        ))}
                    </div>
                </CardHeader>
                <CardBody>
                    <Orders commandesInitiales={commandes} session={session} />
                </CardBody>
            </Card>
        </div>
    );
}
