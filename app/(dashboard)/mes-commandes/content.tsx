"use client";

import { useState } from "react";
import Orders from "./components/orders";
import { title } from "@/components/primitives";
import { Card, CardHeader, CardBody, Button, } from "@heroui/react";
import { PageResponse, CommandeExterne } from "@/src/actions/commandes.actions";

export default function Content({ commandesInitiales, session }: { commandesInitiales: PageResponse<CommandeExterne> | null, session: any }) {
    const [commandes, setCommandes] = useState(commandesInitiales);

    return (
        <div className="w-full h-full flex flex-col gap-6 mb-4">
            <div className="flex items-center">
                <h5 className={title({ size: "h5", class: "text-primary" })}>Mes Commandes</h5>
            </div>                      

            <Orders commandesInitiales={commandes} session={session} />
        </div>
    );
}
