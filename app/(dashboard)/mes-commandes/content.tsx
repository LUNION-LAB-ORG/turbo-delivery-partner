"use client";

import { useState } from "react";
import Orders from "./components/orders";
import { title } from "@/components/primitives";
import { PageResponse } from "@/src/actions/commandes.actions";
import { Order } from "@/types/models";

type ContentProps = {
    commandesInitiales: PageResponse<Order> | null;
    session: any;
};

export default function Content({ commandesInitiales, session }: ContentProps) {
    const [commandes, setCommandes] = useState(commandesInitiales);

    return (
        <div className="w-full h-full flex flex-col gap-6 mb-4 p-2">
            <div className="flex items-center">
                <h5 className={title({ size: "h5", class: "text-primary" })}>Mes Commandes</h5>
            </div>                     
            <Orders commandesInitiales={commandes} session={session} />
        </div>
    );
}
